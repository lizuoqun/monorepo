<!-- 组件 -->
<script setup lang="js">
import { ref } from 'vue';

const massage = ref('Hello Vue3!');
</script>

<template>
  <div>
    <div class="title">{{ massage }}</div>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view></router-view>
  </div>
</template>
<style>
.title {
  background-color: #f0f0f0;
  margin: 10px;
  padding: 10px;
  color: red;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
</style>
