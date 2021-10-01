<template>
  <the-head class="the-head" />
  <div class="content-wrap">
    <left-bar class="left-bar"
      :list="contentList"
      :tmp-list="tmpList"
      @submit="submit"
      @parse="confirmFirstParse"
      @reverse="reverseList"
      @list-update="listUpdate"
      @update-tag="updateTag"
      @reset="reset"/>
    <right-content class="right-content" />
  </div>
</template>

<script lang="ts" setup>
import TheHead from '@/components/TheHead'
import LeftBar from '@/components/LeftBar'
import RightContent from '@/components/RightContent'
import {ref, toRefs, reactive, computed} from 'vue'
interface Text {
  text: string,
  note: string,
  checked: boolean,
  isEdit: boolean
}
const isElectron = !!process.env.IS_ELECTRON
const contentList = ref<Text[]>([])
const tmpList = ref<Text[]>([])
const checkedMemo = computed<Array<Text>>(() => contentList.value.filter(i => i.checked))
let loading = ref(false)
let index = ref(0)
function submit (url: string = '') {
  loading.value = true
  index.value = 0
  // sendMemo(url, checkedMemo, index)
}
function sendMemo(){}
function confirmFirstParse(){

}
function reverseList(){

}
function listUpdate(){

}
function updateTag(){

}
function reset(){

}
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: #FAFAFA;
  .content-wrap{
    height: 0px;
    flex: 1;
    display: flex;
    .left-bar{
      width: 260px;
    }
    .right-content{
      width: 0;
      flex: 1;
    }
  }
}
</style>
