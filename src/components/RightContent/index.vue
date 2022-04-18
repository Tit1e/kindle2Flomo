<template>
  <div class="right-content" :class="{electron: isElectron}">
    <right-content-bar
      :class="{'right-content-position': isElectron}"
      @export="exportCSV"
    />
    <div class="content-box">
      <div class="memo-box">
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

const $emit = defineEmits([
  'export',
])

function exportCSV(){
  $emit('export')
}

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
      flex-wrap: wrap;
      align-content: space-between;
      .memo-item{
        width: calc((100% - 20px) / 3);
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-child(3n) {
          margin-right: 0px;
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
          text-align: justify;
        }
      }
    }
  }
}
</style>
