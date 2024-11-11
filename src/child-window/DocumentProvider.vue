<script setup lang="ts">
import { provide } from 'vue';

const DocumentContext = Symbol('DocumentContext');

const props = defineProps<{
  document: Document;
}>();

provide(DocumentContext, props.document);
</script>
<template>
    <slot></slot>
</template>

