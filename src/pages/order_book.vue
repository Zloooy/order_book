<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="6" class="pa-2">
        <span class="text-h3 d-none d-md-inline pb-1"> Bids </span>
        <order-book-table
          :loading="loading"
          :book="bids"
          price-class="text-red"
        />
      </v-col>
      <v-col cols="12" sm="6" class="pa-2">
        <span class="text-h3 d-none d-md-inline pb-1"> Asks </span>
        <order-book-table
          :loading="loading"
          :book="asks"
          price-class="text-green"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-select
          label="Page size"
          v-model="page_size"
          :items="page_size_mappings"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useOrderBookStore } from "@/stores/order_book.ts";
import { storeToRefs } from "pinia";
import page_size_mappings from "@/mappings/PageSizeMappings.ts";
const order_book = useOrderBookStore();
const { asks, bids, page_size, loading } = storeToRefs(order_book);
onMounted(order_book.fetchDepth);
onBeforeUnmount(order_book.$reset);
storeToRefs;
</script>
