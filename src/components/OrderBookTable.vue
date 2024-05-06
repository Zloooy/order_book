<template>
  <v-table fixed-header :height="tableHeight" hover>
    <v-skeleton-loader :loading="loading" v-if="loading" type="table-thead" />
    <thead v-else class="bg-grey-darken-4">
      <th class="text-left">Price</th>
      <th class="text-left d-none d-md-table-cell">Quantity</th>
      <th class="text-left">Total</th>
    </thead>
    <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody" />
    <tbody v-else>
      <transition-group name="slide-fade">
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
      </transition-group>
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
  loading: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  book: () => [],
  priceClass: null,
  loading: false,
});
const priceCellClass = computed(() => ({
  "text-left": true,
  ...(props.priceClass ? { [props.priceClass]: true } : {}),
}));
const { xs } = useDisplay();
const tableHeight = computed(() => (xs.value ? "35vh" : "75vh"));
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  mix-blend-mode: plus-lighter;
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  mix-blend-mode: plus-lighter;
  transition: all 0.9s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  opacity: 0.5;
}
.slide-fade-leave-to {
  mix-blend-mode: plus-lighter;
  opacity: 100%;
}
</style>
