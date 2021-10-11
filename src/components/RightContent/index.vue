<template>
  <div class="right-content" :class="{electron: isElectron}">
    <right-content-bar
      :class="{'right-content-position': isElectron}"
    />
    <div class="content-box">
      <div class="memo-box" :style="{height: boxHeight}">
        <memo-card
          @dblclick.native.stop="showDialog(item)"
          v-for="(item, index) in contentList"
          :key="item.text"
          class="memo-item"
          v-model:input="item.text"
          v-model:check="item.checked"
          v-model:edit="item.isEdit"
          :info="item"
          :index="index"
        />
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      center
      width="600px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-input v-model="activeItem.text" type="textarea" :autosize="{ minRows: 16, maxRows: 36 }" placeholder="" clearable></el-input>
      <template #footer>
          <el-button @click="closeDialog" size="mini" type="primary">完成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import RightContentBar from '@/components/RightContentBar'
import MemoCard from '@/components/MemoCard'
import { nextTick, watch, ref, computed, onMounted } from 'vue'
import {useStore} from 'vuex'

const store = useStore()
const isElectron = store.getters.isElectron

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
function addListener(){
  let timer = null
  window.addEventListener('resize', e => {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      computedHeight()
      clearTimeout(timer)
      timer = null
    }, 500)
  })
}
onMounted(() => {
  addListener()
})
const contentList = computed(() => {
  const contentList = store.getters.textList
  if(contentList.length === 2){
    const empty = {
      text: '',
      note: '',
      isEdit: false,
      checked: false,
      isEmpty: true
    }
    return [...contentList, empty]
  }
  return contentList
})
watch(
  () => contentList,
  val => {
    computedHeight()
  },
  { deep: true }
)


const dialogVisible = ref(false)
const activeItem = ref({})
function showDialog (item){
  activeItem.value = item
  dialogVisible.value = true
}
function closeDialog(){
  activeItem.value = {}
  dialogVisible.value = false
}

</script>

<style lang="scss" scoped>
.right-content {
  position: relative;
  display: flex;
  flex-direction: column;
  &.electron{
    margin-top: -40px;
    padding-top: 40px;
  }
  &-position {
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
  :deep(.el-dialog) {
    border-radius: 6px;
    .el-dialog__header{
      display: none;
    }
    .el-dialog__body{
      padding: 20px 10px 0px;
      .el-textarea{
        .el-textarea__inner{
          border: none;
        }
      }
    }
  }
}
</style>
