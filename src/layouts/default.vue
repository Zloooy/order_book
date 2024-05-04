<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" height="10vh" temporary>
      <v-list>
        <v-list-item
          v-for="item in menu"
          :key="item.title"
          :title="item.title"
          :to="item.to"
        />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar>
      <template #prepend>
        <v-img height="10vh" width="3vw" src="@/assets/logo.svg" />
        <v-app-bar-nav-icon @click.stop="toggleDrawer" />
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
const drawer: Ref<boolean> = ref(false);
const menu = [
  {
    title: "Settings",
    to: { name: "/" },
  },
  { title: "Order book", to: { name: "/order_book" } },
];
function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>
