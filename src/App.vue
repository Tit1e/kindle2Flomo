<template>
  <the-head class="the-head" v-if="isElectron" />
  <div class="content-wrap" v-loading="loading" :element-loading-text="loadingText">
    <left-bar
      class="left-bar"
      ref="leftContent"
      @submit="submit"
      @parse="parse"
      @list-update="listUpdate"
      @update-tag="updateTag"
    />
    <right-content class="right-content" @export="exportCSV" />
  </div>
</template>

<script lang="ts" setup>
import TheHead from '@/components/TheHead'
import LeftBar from '@/components/LeftBar'
import RightContent from '@/components/RightContent'
import { ref, toRefs, toRef, reactive, computed, nextTick, watch, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import addMemo from '@/utils/addMemo'
import JSonToCSV from '@/utils/exportCSV'
import { useStore } from 'vuex'
interface Text {
  text: string
  note: string
  checked: boolean
  isEdit: boolean
}
const store = useStore()
const isElectron = store.getters.isElectron
const importCount = computed(() => store.getters.importCount)
const selectedList = computed(() => store.getters.selectedList)
const tag = ref('')
let loading = ref(false)
let index = ref(0)

const loadingText = computed(() => {
  return `为减轻服务器压力，导入间隔为 1s。导入进度： ${index.value + 1}/${
    selectedList.value.length
  }`
})

function submit (url: string = '') {
  loading.value = true
  index.value = 0
  sendMemo(url, selectedList.value, index.value)
}
function sendMemo (url, list, _index) {
  const item = list[_index]
  addMemo(url, item.text).then(res => {
    store.commit('SET_IMPORT_COUNT', importCount.value + 1)
    store.commit('SET_SUCCESS', item)
    if (_index < list.length - 1) {
      setTimeout(() => {
        index.value += 1
        sendMemo(url, list, index.value)
      }, 1000)
    } else {
      ElMessage.success('导入完毕')
      loading.value = false
    }
  })
  .catch(e => {
    console.error(e)
    loading.value = false
    ElMessage.error('导入失败')
  })
}
function parse (options) {
  store.commit('SET_TEXT_LIST', {
    options,
    tag: tag.value
  })
}

function listUpdate ({ list, options }) {
  store.commit('SET_TEMP_LIST', list)
  store.commit('SET_TEXT_LIST', {
    options,
    tag: tag.value
  })
}
function updateTag (_tag) {
  tag.value = _tag
}
const leftContent = ref(null)
function exportCSV(){
  const title = leftContent.value.exportCSV()
  const contentList = store.getters.textList.map(i => {
    i._text = i._text.replace(/\r/g,"").replace(/\n/g,"")
    i.note = i.note || ''
    i._tag = i._tag || ''
    return i
  })
  console.log(title, contentList)
  JSonToCSV.setDataConver({
    data: contentList,
    fileName: title,
    columns: {
      title: ['书摘', '笔记', '标签'],
      key: ['_text', 'note', '_tag']
    }
  })
}
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: #fafafa;
  .content-wrap {
    height: 0px;
    flex: 1;
    display: flex;
    .left-bar {
      width: 280px;
    }
    .right-content {
      width: 0;
      flex: 1;
    }
  }
}
</style>
