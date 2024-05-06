import { defineStore } from "pinia";
import { useAppStore } from "./app";
import { computed, ref, Ref } from "vue";
import { Order } from "@/types/Order.ts";
import page_size_mappings from "@/mappings/PageSizeMappings.ts";

export const useOrderBookStore = defineStore("order_book", () => {
  const app = useAppStore();
  const asks: Ref<Order[]> = ref([]);
  const bids: Ref<Order[]> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const worker = new Worker(
    new URL("/src/web_workers/order_book_worker.js", import.meta.url),
    { type: "module" },
  );
  function $reset() {
    asks.value = [];
    bids.value = [];
    worker.postMessage({ close: true });
  }
  function fetchDepth() {
    loading.value = true;
    worker.postMessage({
      close: false,
      currency_pair: app.currency_pair,
      page_size: app.page_size,
    });
    worker.onmessage = ({ data }) => {
      loading.value = false;
      bids.value = data.bids;
      asks.value = data.asks;
    };
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
  return { fetchDepth, asks, bids, $reset, page_size: computed_page_size, loading };
});
