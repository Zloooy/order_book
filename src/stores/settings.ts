import { defineStore } from "pinia";
import { computed } from "vue";
import { CurrencyPairEnum } from "../types/enum/CurrencyPairEnum.ts";
import { useLogsStore } from "./logs.ts";
import currency_pair_mappings from "@/mappings/CurrencyPairMappings.ts";
import { useAppStore } from "./app.ts";

export const useSettingsStore = defineStore("settings", () => {
  const computed_currency_pair = computed(() =>
    currency_pair_mappings.find(({ value }) => value == app.currency_pair),
  );
  const logs = useLogsStore();
  const app = useAppStore();
  function changeCurrencyPair(new_pair: CurrencyPairEnum) {
    if (new_pair !== app.currency_pair) {
      console.log(`new_pair ${new_pair}`);
      console.log(`currency_pair ${app.currency_pair}`);
      logs.addRecord(`${app.currency_pair} ➛ ${new_pair}`);
      app.setCurrencyPair(new_pair);
    }
  }
  return { currency_pair: computed_currency_pair, changeCurrencyPair };
});
