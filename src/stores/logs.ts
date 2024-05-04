import { defineStore } from "pinia";
import { reactive } from "vue";
import { LogEntry } from "@/types/dto/LogEntry";

export const useLogsStore = defineStore("logs", () => {
  const logs: LogEntry[] = reactive([]);
  function addRecord(action: string) {
    logs.push({
      action,
      time: new Date(),
    });
    console.log(logs);
  }
  return { logs, addRecord };
});
