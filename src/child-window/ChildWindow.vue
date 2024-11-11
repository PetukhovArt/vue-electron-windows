<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { Teleport } from 'vue';
import { windowsManagerRenderer } from './window-manager-renderer';
import DocumentProvider from './DocumentProvider.vue';
import StyleProvider from './StyleProvider.vue';

const props = defineProps<{
    id: string;
    theme: string;
}>();

const window = computed(() => windowsManagerRenderer.getWindow(props.id));

watchEffect(() => {
    if (window.value) {
        if (props.theme === 'dark') {
            window.value.document.body.classList.add('dark');
        } else {
            window.value.document.body.classList.remove('dark');
        }
    }
});
</script>
<template>
    <Teleport :to="window?.document.body ?? null">
        <DocumentProvider :document="window?.document!">
            <StyleProvider :theme="theme">
                <slot></slot>
            </StyleProvider>
        </DocumentProvider>
    </Teleport>
</template>
