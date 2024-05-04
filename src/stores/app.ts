// Utilities
import { defineStore } from "pinia";
import { ref, Ref } from "vue";
import { CurrencyPairEnum } from "@/types/enum/CurrencyPairEnum.ts";
import { PageSizeEnum } from "@/types/enum/PageSizeEnum";

const CURRENCY_PAIR_KEY: string = "currency_pair";
const PAGE_SIZE_KEY: string = "page_size";
export const useAppStore = defineStore("app", () => {
  const page_size: Ref<PageSizeEnum> = ref(
    (localStorage.getItem(PAGE_SIZE_KEY) &&
      JSON.parse(localStorage.getItem(PAGE_SIZE_KEY)!)) ||
      PageSizeEnum.ONE_HUNDRED,
  );
  function setPageSize(new_size: PageSizeEnum) {
    if (new_size) {
      page_size.value = new_size;
      localStorage.setItem(PAGE_SIZE_KEY, JSON.stringify(new_size));
    }
  }
  const currency_pair: Ref<CurrencyPairEnum> = ref(
    localStorage.getItem(CURRENCY_PAIR_KEY) || CurrencyPairEnum.BTCUSDT,
  );
  function setCurrencyPair(new_pair: CurrencyPairEnum) {
    if (new_pair) {
      currency_pair.value = new_pair;
      localStorage.setItem(CURRENCY_PAIR_KEY, new_pair);
    }
  }
  return { currency_pair, setCurrencyPair, page_size, setPageSize };
});
