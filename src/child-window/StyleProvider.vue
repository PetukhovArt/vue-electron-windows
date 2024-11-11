<template>
  <div :class="props.theme === 'dark' ? 'dark' : ''" v-bind:style="gs">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
// todo: импорт инлайн стилей из глобала
import gs from '../style.css?inline';

const ThemeContext = Symbol('ThemeContext');

const props = defineProps<{
  theme: string;
}>();

provide(ThemeContext, props.theme);

</script>
<!--<style>-->
<!--@import './global.css?inline';-->
<!--</style>-->
