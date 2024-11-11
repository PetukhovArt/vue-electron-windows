<script setup lang="ts">
import ChildWindow from "./child-window/ChildWindow.vue";
import {windowsManagerRenderer} from "./child-window/window-manager-renderer";
import {ref} from "vue";

const currentId = ref('')

const onCreateWindow = () => {
  const id = Date.now().toString()
  currentId.value=id
  windowsManagerRenderer.createTriggersWindow(id)
}
const counter = ref(0)

setInterval(() => {
  counter.value++
}, 1000)

</script>

<template>
<div>
  <button @click="onCreateWindow">open child</button>
  <select>
    <option
      v-for="id in windowsManagerRenderer.windowIds"
      :key="id"
      :value="id"
      :selected="id === currentId"
      @click="currentId=id"
    >
      {{ id }}
    </option>
  </select>
  <ChildWindow v-for="(id, index) in windowsManagerRenderer.windowIds" :key="id" :id="id"
  theme="dark"
  >
    <div>{{counter}}</div>
  </ChildWindow>
</div>
</template>

<style>

</style>
