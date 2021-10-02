<template>
  <div class="right-content">
    <right-content-bar
      class="right-content-bar"
      :selected="checkedMemo.length"
      :total="contentList.length"
      :import-count="importCount"
      :disabled="disabled"
    />
    <div class="content-box">
      <div class="memo-box" :style="{height: boxHeight}">
        <memo-card
          v-for="(item, index) in contentList"
          class="memo-item"
          :input.sync="item.text"
          v-model:check="item.checked"
          :edit.sync="item.isEdit"
          :info="item"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RightContentBar from '@/components/RightContentBar'
import MemoCard from '@/components/MemoCard'
import { nextTick, watch, ref, computed } from 'vue'

const props = defineProps({
  contentList: {
    type: Array,
    default: () => []
  }
})

const boxHeight = ref('1000000px')
async function computedHeight(){
  boxHeight.value = '1000000px'
  await nextTick()
  const items = document.querySelectorAll('.memo-item')
  let maxHeight = 0
  const lastIndex = items.length - 1
  for(let i = lastIndex; i > 0; i--){
    const { offsetTop, clientHeight} = items[i]
    const height = offsetTop + clientHeight
    if(height > maxHeight){
      maxHeight = height
    }
  }
  boxHeight.value = `${maxHeight}px`
}
const contentList = ref(props.contentList)
watch(
  () => props.contentList,
  val => {
    contentList.value = [...val]
    computedHeight()
  },
  { deep: true }
)
const checkedMemo = computed(() => contentList.value.filter(i => i.checked))
console.log(checkedMemo)
const disabled = computed(() => checkedMemo.value.length >= 100)
const importCount = ref(0)
function setDate () {
  const D = new Date()
  const y = D.getFullYear()
  const m = D.getMonth() + 1
  const d = D.getDate()
  return `${y}${m}${d}`
}
const date = setDate()
function geImportCount (date: string) {
  let Obj = JSON.parse(localStorage.getItem('importCount') || '{}')
  importCount.value = +Obj[date] || 0
}
geImportCount(date)

</script>

<style lang="scss" scoped>
.right-content {
  margin-top: -40px;
  padding-top: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  &-bar {
    position: absolute;
    margin-top: -40px;
  }
  .content-box{
    flex: 1;
    padding: 10px 10px 0px;
    overflow: auto;
    .memo-box{
      display: flex;
      flex-flow: column wrap;
      align-content: space-between;
      &::before, &::after{
        content: "";
        flex-basis: 100%;
        width: 10px;
        order: 2;
      }
      .memo-item{
        width: calc((100% - 20px) / 3);
        &:nth-child(3n+1) {
          order: 1;
        }
        &:nth-child(3n+2) {
          order: 2;
        }
        &:nth-child(3n) {
          order: 3;
        }
      }
    }
  }
}
</style>
