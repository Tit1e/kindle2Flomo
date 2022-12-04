<template>
  <div class="memo-card radius memo-icon"
  :class="{ active: props.info.checked, empty: props.info.isEmpty, 'uploaded': showUploaded, 'edit': showEdit, 'num-cover': showUploaded || showEdit }"
  @click="toggleChecked">
    <a v-if="(info.assetid && info.localtion)" :href="`ibooks://assetid/${info.assetid}#${info.localtion}`" class="book-mark" @click.stop title="在 Apple Books 中查看">
    </a>
    <div class="num-icon" :data-index="index + 1" @click="e => resetMemo(e, props.info)">{{(showUploaded || showEdit) ? '' : index + 1}}</div>
    <div class="priview">
      <pre v-html="info.content_update || info.content"></pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
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

const showUploaded = computed(() => props.info.uploaded)
const showEdit = computed(() => (!props.info.uploaded && props.info.content_update))

const $emit = defineEmits(['click', 'reset'])

function resetMemo(e: any, item: any) {
  e.stopPropagation()
  if(!item.content_update && !item.uploaded) return
  ElMessageBox.confirm(
    '该 memo 的内容与状态都将被还原，是否继续？',
    '还 原',
    {
      closeOnClickModal: false,
      confirmButtonText: '还 原',
      cancelButtonText: '取 消',
      type: 'warning',
    }
  )
    .then(() => {
      $emit('reset', item)
    })
    .catch(() => {})
}



// 避免双击触发两次单机事件
let timer: any = null
let clicking = false
function toggleChecked(){
  if(timer) {
    clicking = true
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    if(!clicking){
      $emit('click')
    }
    clearTimeout(timer)
    clicking = false
    timer = null
  }, 200)
}
</script>

<style lang="scss" scoped>
.memo-card {
  background-color: #d5f0e7;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 6px rgba($color: #000000, $alpha: 0.03);
  box-sizing: border-box;
  max-height: 300px;
  padding: 10px;
  position: relative;
  z-index: 0;
  cursor: pointer;
  &:hover{
    .book-mark{
      opacity: 1;
      transition: ease-in-out 350ms;
    }
  }
  .book-mark{
    position: absolute;
    z-index: 10;
    width: 26px;
    height: 26px;
    opacity: 0;
    top: 10px;
    right: 10px;
    background-image: url(~@/assets/img/applebooks.png);
    background-size: 100%;
  }
  .num-icon{
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #fff;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 50%;
    opacity: 0.4;
    color: #ccc;
    font-size: 18px;
    font-weight: bolder;
    z-index: 9;
  }
  &.memo-icon{
    .num-icon{
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 18px;
    }
  }
  &.uploaded{
    cursor: not-allowed;
    opacity: 0.6;
    .num-icon{
      opacity: 1;
      background-image: url(~@/assets/img/watermark.png);
    }
  }
  &.edit{
    .num-icon{
      opacity: 0.6;
      background-image: url(~@/assets/img/edit.png);
    }
  }
  &.num-cover.uploaded, &.num-cover.edit{
    .num-icon:hover{
      &::before{
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #000000;
        content: attr(data-index);
      }
    }
  }
  .top-bar{
    line-height: 24px;
    opacity: 0.5;
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
    position: relative;
    z-index: 2;
    width: 100%;
    font-size: 14px;
    user-select: none;
    box-sizing: border-box;
    overflow: auto;
    flex: 1;
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
      line-height: 1.8;
    }
  }
}
</style>
