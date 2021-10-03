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
          @dblclick.native.stop="showDialog(item)"
          v-for="(item, index) in contentList"
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
      title="编辑 MEMO"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-input v-model="activeItem.text" type="textarea" :autosize="{ minRows: 6 }" placeholder="" clearable></el-input>
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

const props = defineProps({
  contentList: {
    type: Array,
    default: () => []
  },
  importCount: {
    type: Number,
    default: 0
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
const contentList = ref(props.contentList)
watch(
  () => props.contentList,
  val => {
    contentList.value = [...val]
    if(val.length === 2){
      const empty = {
        text: '',
        note: '',
        isEdit: false,
        checked: false,
        isEmpty: true
      }
      contentList.value.push(empty)
    }
    computedHeight()
  },
  { deep: true }
)
const checkedMemo = computed(() => contentList.value.filter(i => i.checked))
const disabled = computed(() => checkedMemo.value.length >= 100)


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
