<script setup lang="ts">
import useDynHook from "../src";

const dynHook = useDynHook();
console.log("dynHook", dynHook);
</script>

<template>
  <main class="dyn-hook-container"></main>
</template>

<style lang="scss" scoped>
.dyn-hook-container {
}
</style>
