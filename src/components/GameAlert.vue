<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps({
	show: {
		type: Boolean,
		required: true,
	},
})

const show = ref(props.show)

watch(
	() => props.show,
	(newShow) => {
		show.value = newShow
	},
)

function close() {
	show.value = false
}
</script>

<template>
  <div role="alert" class="alert" v-if="show">
    <div class="alert__content">
      <p>Congrats you won !</p>
    </div>
    <div class="backdrop" @click="close"></div>
  </div>
</template>

<style>
.alert__content {
  position: fixed;
  max-width: 500px;
  background: var(--port-gore);
  font-size: 2em;
  inset: 0;
  margin: auto;
  height: fit-content;
  padding-block: 40px;
  z-index: 90;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.backdrop {
  z-index: 5;
  display: block;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
</style>
