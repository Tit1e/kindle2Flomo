<template>
  <div class="memo-card radius" :class="{active: checked, empty: isEmpty}" @click="toggleChecked">
    <div class="priview" @dblclick="handleEdit(content)">
      <template v-if="isEdit">
        <el-input
          v-model="content"
          @click.stop
          type="textarea"
          autosize
          :rows="5"
        ></el-input>
        <div class="pt-10 text-right">
          <el-button type="primary" size="mini" @click.stop="submit">完成</el-button>
        </div>
      </template>
      <pre v-else>{{ content }}</pre>
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
const $emit = defineEmits(['update:edit', 'update:check', 'update:input', 'open'])
let content = toRef(props.info,'text')
let checked = toRef(props.info, 'checked')
let isEdit = toRef(props.info, 'isEdit')
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

function toggleChecked(){
  checked.value = !checked.value
}

function handleEdit (content) {
  // $emit('update:edit', true)
  // $emit('open')
  // ElMessageBox.prompt('', '编辑 Memo', {
  //       confirmButtonText: '完成',
  //       cancelButtonText: '取消',
  //       inputValue: content,
  //       inputType: 'textarea'
  //     })
  //       .then(({ value }) => {
  //         $emit('update:input', value)
  //       })
  //       .catch(() => {

  //       })
}
function submit () {
  $emit('update:edit', false)
  $emit('update:input', content.value)
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
  }
}
</style>
