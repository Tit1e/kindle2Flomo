<template>
  <div class="memo-card radius" :class="{active: props.info.checked, empty: props.info.isEmpty, 'text-highlight': props.info.send}" @click="toggleChecked">
    <div class="priview">
      <pre v-html="props.info.text"></pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, toRef } from 'vue'
import {ElMessageBox} from 'element-plus'
const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  }
})
const info = props.info
const $emit = defineEmits(['update:edit', 'update:check', 'update:input', 'open'])
let content = toRef(props.info,'text')
let checked = toRef(props.info, 'checked')
let isEdit = toRef(props.info, 'isEdit')
let send = toRef(props.info, 'send')
const isEmpty = toRef(props.info, 'isEmpty')
watch(
  () => props.info,
  ({ checked, text, isEdit }) => {
    content = text
    checked = checked
    isEdit = isEdit
  }
)
watch(
  () => isEdit,
  value => {
    $emit('update:edit', value)
  }
)
watch(
  () => checked,
  value => {
    $emit('update:check', value.value)
  },
  {deep: true}
)
let timer: any = null
let clicking = false
function toggleChecked(){
  if(timer) {
    clicking = true
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    if(!clicking){
      checked.value = !checked.value
    }
    clearTimeout(timer)
    clicking = false
    timer = null
  }, 200)
}
function submit () {
  $emit('update:edit', false)
  $emit('update:input', content.value)
}
</script>

<style lang="scss" scoped>
.memo-card {
  background-color: #d5f0e7;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 10px 6px rgba($color: #000000, $alpha: 0.03);
  box-sizing: border-box;
  &:hover{
    cursor: pointer;
  }
  &.active{
    background-color: #55bb8e;
    color: #fff!important;
  }
  &.empty{
    opacity: 0!important;
    cursor: default!important;
    pointer-events: none!important;
  }
  .input {
    flex: 1;
    margin-left: 20px;
  }
  .priview {
    padding: 10px;
    width: 100%;
    font-size: 14px;
    user-select: none;
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
      line-height: 1.8;
    }
    :deep(._tag) {
      color: #5783f7;
      cursor: pointer;
      background-color: #eef3fe;
      padding: 4px;
      font-size: 12px;
      border-radius: 3px;
      display: inline-block;
    }
  }
}
</style>
