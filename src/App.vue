<script lang="ts" setup>
import ChildWindow from "./child-window/ChildWindow.vue";
import {windowsManagerRenderer} from "./child-window/window-manager-renderer";
import {ref} from "vue";
import {nanoid} from "nanoid";
import RecursiveItem from "./tree-binary/RecursiveItem.vue";

const currentId = ref("");

const onCreateWindow = () => {
  const id = nanoid();
  currentId.value = id;
  windowsManagerRenderer.createTriggersWindow(id);
};
const counter = ref(0);
// setInterval(() => {
//   counter.value++;
// }, 1000);

</script>

<template>
  <div>
    <RecursiveItem/>
  </div>
  <div>
    <!--    <button @click="onCreateWindow">open child</button>-->
    <!--    <div>{{ counter }}</div>-->
    <!--    <select>-->
    <!--      <option-->
    <!--          v-for="id in windowsManagerRenderer.windowIds"-->
    <!--          :key="id"-->
    <!--          :selected="id === currentId"-->
    <!--          :value="id"-->
    <!--          @click="currentId = id"-->
    <!--      >-->
    <!--        {{ id }}-->
    <!--      </option>-->
    <!--    </select>-->
    <ChildWindow
        v-for="id in windowsManagerRenderer.windowIds"
        :id="id"
        :key="id"
        theme="dark"
    >
      <div>{{ counter }}</div>
    </ChildWindow>
  </div>
</template>

<style></style>
