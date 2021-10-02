<template>
  <div class="memo-card radius" :class="{active: checked}" @click="toggleChecked">
    <div class="priview" @dblclick="handleEdit">
      <template v-if="isEdit">
        <el-input
          v-model="content"
          type="textarea"
          autosize
          :rows="5"
        ></el-input>
        <div class="pt-10 text-right">
          <el-button type="primary" size="mini" @click="submit">完成</el-button>
        </div>
      </template>
      <pre v-else>{{ content }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, toRef } from 'vue'
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
const $emit = defineEmits(['update:edit', 'update:check', 'update:input'])
let content = toRef(props.info,'text')
let checked = toRef(props.info, 'checked')
let isEdit = toRef(props.info, 'isEdit')
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

function toggleChecked(){
  checked.value = !checked.value
}

function handleEdit () {
  $emit('update:edit', true)
}
function submit () {
  $emit('update:edit', false)
  $emit('update:input', content)
}
</script>

<style lang="scss" scoped>
.memo-card {
  background-color: #e4f5ef;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 10px 6px rgba($color: #000000, $alpha: 0.03);
  &:hover{
    cursor: pointer;
  }
  &.active{
    background-color: #9debd0;
  }
  .input {
    flex: 1;
    margin-left: 20px;
  }
  .priview {
    padding: 10px;
    width: 100%;
    font-size: 14px;
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
      line-height: 1.8;
    }
  }
}
</style>
