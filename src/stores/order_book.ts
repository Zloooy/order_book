import { defineStore } from "pinia";
import { Api } from "@api/Api.ts";
import { useAppStore } from "./app";
import { computed, ref, Ref } from "vue";
import { Order } from "@/types/Order.ts";
import { Decimal } from "decimal.js";
import page_size_mappings from "@/mappings/PageSizeMappings.ts";

export const useOrderBookStore = defineStore("order_book", () => {
  const api = new Api();
  const app = useAppStore();
  const asks: Ref<Order[]> = ref([]);
  const bids: Ref<Order[]> = ref([]);
  const ws: Ref<WebSocket | undefined> = ref();
  const lastUpdateId: Ref<number> = ref(-1);
  const book_events: Ref<[]> = ref([]);
  function $reset() {
    ws.value?.close?.();
    asks.value = [];
    bids.value = [];
    ws.value = undefined;
    lastUpdateId.value = -1;
    book_events.value = [];
  }
  function order_mapper([p, q]: [number, number]): Order {
    const price = new Decimal(p);
    const quantity = new Decimal(q);
    return {
      price,
      quantity,
      total: price.mul(quantity),
    };
  }
  function order_comparator(a, b) {
    return b.price.comparedTo(a.price);
  }
  let onWebSocketMessage = () => {};
  async function fetchDepth() {
    const { ok, data } = await api.api.v3DepthList({
      symbol: app.currency_pair,
      limit: app.page_size,
    });
    if (ok) {
      ws.value = new WebSocket(
        `wss://stream.binance.com:9443/ws/${app.currency_pair.toLowerCase()}@depth`,
      );
      ws.value.addEventListener("message", onWebSocketMessage);
      asks.value = data.asks
        .map(order_mapper)
        .toSorted(order_comparator)
        .slice(0, app.page_size);
      bids.value = data.bids
        .map(order_mapper)
        .toSorted(order_comparator)
        .slice(0, app.page_size);
      lastUpdateId.value = data.lastUpdateId;
    }
  }
  const computed_page_size = computed({
    get() {
      return page_size_mappings.find(({ value }) => value === app.page_size);
    },
    set(newVal) {
      app.setPageSize(newVal);
      $reset();
      fetchDepth();
    },
  });
  function updateOrdersFromMessage(message_orders, orders) {
    for (const message_order of message_orders) {
      const matching_order_index = orders.value.findIndex(({ price }) =>
        price.equals(message_order[0]),
      );
      const message_order_quantity = new Decimal(message_order[1]);
      if (matching_order_index !== -1) {
        if (message_order_quantity.isZero()) {
          orders.value.splice(matching_order_index, 1);
        } else {
          const matching_order = orders.value[matching_order_index];
          matching_order.quantity = message_order_quantity;
          matching_order.total = matching_order.price.mul(
            matching_order.quantity,
          );
        }
      } else if (!message_order_quantity.isZero()) {
        orders.value.push(order_mapper(message_order));
      }
    }
    orders.value.sort(order_comparator);
    if (orders.value.length > app.page_size) {
      orders.value = orders.value.slice(0, app.page_size);
    }
  }
  function processActualMessage(message) {
    updateOrdersFromMessage(message.b, bids);
    updateOrdersFromMessage(message.a, asks);
    lastUpdateId.value = message.u;
  }
  onWebSocketMessage = function (m) {
    if (m.data) {
      const message = JSON.parse(m.data);
      if (message.u > lastUpdateId.value) {
        processActualMessage(message);
      }
    }
  };
  return { fetchDepth, asks, bids, $reset, page_size: computed_page_size };
});
