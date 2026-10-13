<script setup>
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>
