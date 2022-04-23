<template>
  <the-head class="the-head" v-if="isElectron" />
  <div
    class="content-wrap"
  >
    <left-bar
      class="left-bar"
      ref="leftContent"
      @submit="submit"
      @parse="parse"
      @list-update="listUpdate"
      @update-tag="updateTag"
    />
    <right-content class="right-content" />
  </div>
</template>

<script lang="ts" setup>
import TheHead from '@/components/TheHead'
import LeftBar from '@/components/LeftBar'
import RightContent from '@/components/RightContent'
import init from '@/utils/init.js'
import {
  ref,
  computed,
} from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import addMemo from '@/utils/addMemo'
import { useStore } from 'vuex'
import { dexiePut } from '@/db/dexie'
import { delField} from '@/utils/utils'
import { watch } from 'original-fs'

interface Text {
  text: string
  note: string
  checked: boolean
}


const store = useStore()
const bookSort = JSON.parse(localStorage.getItem('bookSort') || '[]').reverse()
init(bookSort)

const isElectron = store.getters.isElectron
const importCount = computed(() => store.getters.importCount)
const selectedList = computed(() => store.getters.selectedList)
const tag = ref('')
let index = ref(0)
const total = ref(0)

const loadingText = computed(() => {
  return `为减轻服务器压力，导入间隔为 1s。导入进度： ${index.value + 1}/${total.value}`
})


const loading = ref(null)

function submit (url: string = '') {
  total.value = selectedList.value.length
  loading.value = ElLoading.service({
    lock: true,
    text: loadingText,
  })
  index.value = 0
  sendMemo(url, selectedList.value, index.value)
}
async function sendMemo (url, list, _index) {
  loading.value.setText(loadingText)
  try {
    const item = list[_index]
    const { code, message } = await addMemo(url, item.content_update || item.content)
    if(code === 0){
      item.uploaded = true
      item.checked = false
      item.content_update = item.content
      store.commit('SET_IMPORT_COUNT', importCount.value + 1)
      store.commit('UPDATE_TEXT_LIST', {uuid: item.uuid, uploaded: true, checked: false, content_update: item.content})
      await dexiePut(delField(item))
      if (_index < list.length - 1) {
        setTimeout(() => {
          index.value += 1
          sendMemo(url, list, index.value)
        }, 1000)
      } else {
        loading.value.close()
        ElMessage.success(message)
      }
    }else{
      ElMessage.error(message)
    }
  } catch (error) {
    ElMessage.error('导入失败')
    loading.value.close()
  }
}
function parse (options) {
  store.commit('UPDATE_PARSE_OPTIONS', {
    options,
    tag: tag.value
  })
}

function listUpdate ({ list, options }) {
  store.commit('UPDATE_PARSE_OPTIONS', {
    options,
    tag: tag.value
  })
}
function updateTag (_tag) {
  tag.value = _tag
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
