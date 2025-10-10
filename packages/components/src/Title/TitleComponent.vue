<template>
  <div>
    <h1>Title</h1>
  </div>
</template>

<script setup lang="ts">
// 修改utils子包里面的module字段为打包后的ems的index.js
// types指定对应的d.ts文件
import { hello } from '@monorepo/utils';

hello();
</script>
