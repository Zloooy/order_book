import { Api } from "@api/Api.ts";
let lastUpdateId = -1;
let bids = [];
let asks = [];
let currency_pair = null;
const api = new Api();
let websocket = null;
import { Decimal } from "decimal.js";
onmessage = async (message) => {
  if (websocket) {
    if (currency_pair) {
      websocket.send(
        JSON.stringify({
          method: "UNSBSCRIBE",
          params: [`${currency_pair.toLowerCase()}@depth`],
          id: lastUpdateId,
        }),
      );
      currency_pair = null;
    }
  }
  lastUpdateId = -1;
  bids = [];
  asks = [];
  if (message.data.close) {
    websocket?.close?.();
    websocket = null;
    return;
  } else {
    const { ok, data } = await api.api.v3DepthList({
      symbol: message.data.currency_pair,
      limit: message.data.page_size,
    });
    if (ok) {
      currency_pair = message.data.currency_pair;
      bids = data.asks.map(order_mapper).toSorted(order_comparator);
      asks = data.asks.map(order_mapper).toSorted(order_comparator);
      postTable();
      if (!websocket) {
        websocket = new WebSocket(
          `wss://stream.binance.com:9443/ws/${message.data.currency_pair.toLowerCase()}@depth`,
        );
      } else {
        websocket.send({
          method: "SUBSCRIBE",
          params: [`${message.data.currency_pair.toLowerCase()}@depth`],
          id: 1,
        });
      }
      websocket.addEventListener("message", onWebSocketMessage);
    }
  }
};

function onWebSocketMessage(m) {
  if (m.data) {
    const message = JSON.parse(m.data);
    if (message.u > lastUpdateId) {
      processActualMessage(message);
    }
  }
}
function order_mapper([p, q]) {
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

function processActualMessage(message) {
  updateOrdersFromMessage(message.b, { value: bids });
  updateOrdersFromMessage(message.a, { value: asks });
  lastUpdateId = message.u;
  postTable();
}

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
}
function serializible_order(order) {
  return {
    price: order.price.toString(),
    quantity: order.quantity.toString(),
    total: order.total.toString(),
  };
}
function postTable() {
  postMessage({
    bids: bids.map(serializible_order),
    asks: asks.map(serializible_order),
  });
}
