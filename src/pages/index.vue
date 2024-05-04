<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          label="Currency pair"
          :model-value="settings.currency_pair"
          @update:model-value="settings.changeCurrencyPair"
          :items="pairs"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-sheet class="pa-2">
          <log-table />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import LogTable from "@/components/LogTable.vue";
import { useSettingsStore } from "@/stores/settings.ts";
import pairs from "@/mappings/CurrencyPairMappings.ts";
const settings = useSettingsStore();
</script>
