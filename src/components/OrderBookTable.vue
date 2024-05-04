<template>
  <v-table fixed-header :height="tableHeight" hover>
    <thead class="bg-grey-darken-4">
      <th class="text-left">Price</th>
      <th class="text-left d-none d-md-table-cell">Quantity</th>
      <th class="text-left">Total</th>
    </thead>
    <tbody>
      <tr v-for="order in props.book" :key="order.price">
        <td :class="priceCellClass">
          {{ order.price }}
        </td>
        <td class="text-left d-none d-md-table-cell">
          {{ order.quantity }}
        </td>
        <td class="text-left">
          {{ order.total }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import Order from "@/types/dto/Order.ts";
import { useDisplay } from "vuetify";
import { computed } from "vue";
export interface Props {
  book: Order[];
  priceClass: string;
}
const props = withDefaults(defineProps<Props>(), {
  book: () => [],
  priceClass: null,
});
const priceCellClass = computed(() => ({
  "text-left": true,
  ...(props.priceClass ? { [props.priceClass]: true } : {}),
}));
const { xs } = useDisplay();
const tableHeight = computed(() => (xs.value ? "35vh" : "75vh"));
</script>
