<template>
  <v-table theme="dark" fixed-header height="90vh">
    <thead>
      <th class="text-left">Time</th>
      <th class="text-left">Action</th>
    </thead>
    <tbody>
      <tr v-for="entry in logs.logs" :key="entry.time">
        <td class="text-left">
          {{ formatTime(entry.time) }}
        </td>
        <td class="text-left">
          {{ entry.action }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script lang="ts" setup>
import { useLogsStore } from "@/stores/logs.ts";

const logs = useLogsStore();
const formatter = Intl.DateTimeFormat("ru-RU", {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});
const formatTime = formatter.format;
</script>
