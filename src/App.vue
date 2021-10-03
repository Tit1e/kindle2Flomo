<template>
  <the-head class="the-head" />
  <div class="content-wrap" v-loading="loading" :element-loading-text="loadingText">
    <left-bar
      class="left-bar"
      :list="contentList"
      :tmp-list="tmpList"
      @submit="submit"
      @parse="confirmFirstParse"
      @list-update="listUpdate"
      @update-tag="updateTag"
      @reset="reset"
    />
    <right-content class="right-content" :import-count="importCount" :content-list="contentList" />
  </div>
</template>

<script lang="ts" setup>
import TheHead from '@/components/TheHead'
import LeftBar from '@/components/LeftBar'
import RightContent from '@/components/RightContent'
import { ref, toRefs, toRef, reactive, computed, nextTick, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import addMemo from '@/utils/addMemo'
interface Text {
  text: string
  note: string
  checked: boolean
  isEdit: boolean
}
const tmpList = ref([])
const contentList = ref([])
const tag = ref('')
const checkedMemo = computed<Array<Text>>(() =>
  contentList.value.filter(i => i.checked)
)
let loading = ref(false)
let index = ref(0)
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

watch(
  () => importCount,
  val => {
    localStorage.setItem(
        'importCount',
        JSON.stringify({
          [date]: val.value
        })
      )
  },
  {deep: true}
)
const loadingText = computed(() => {
  return `为减轻服务器压力，导入间隔为 1s。导入进度： ${index.value + 1}/${
    checkedMemo.value.length
  }`
})

function submit (url: string = '') {
  loading.value = true
  index.value = 0
  sendMemo(url, checkedMemo.value, index.value)
}
function sendMemo (url, list, _index) {
  const item = list[_index]
  const findIndex = contentList.value.findIndex(i => i.text === item.text)
  addMemo(url, item.text).then(res => {
    importCount.value += 1
    contentList.value.splice(findIndex, 1, {...item, send: true, checked: false})
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
function confirmCanEdit (options) {
  const canEdit = localStorage.getItem('canEdit') || '0'
  if (canEdit === '0') {
    ElMessageBox.alert('双击 MEMO 可进入编辑模式', '提示', {
      confirmButtonText: '知道了，不再提示',
      callback: () => {
        localStorage.setItem('canEdit', '1')
        parse(options)
      }
    })
  }
}
function handleTag(options, tag, text){
      const {noTag, tagPosition, noEmptyLine, onlyTag} = options
      let _text = text
      if(!noTag) {
        // tag 位置在上方
        if(tagPosition){
          // 在上方时空行加在 tag 后
          _text = (onlyTag ? `${tag}\r\n\r\n` : (noEmptyLine ? `${tag}\r\n` : `${tag}\r\n\r\n`)) + _text
        }else{
          // 在上方时空行加在 tag 前
          _text = _text + (onlyTag ? `\r\n${tag}` : (noEmptyLine ? tag : `\r\n${tag}`))
        }
      }
      return _text
    }
async function parse (options) {
  const {
    split,
    tagPosition,
    notePosition,
    noEmptyLine,
    onlyTag,
    noTag
  } = options
  contentList.value = []
  // 渲染用的tag
  const _tag = `<div class="_tag">${tag.value}</div>`
  await nextTick()
  contentList.value = JSON.parse(JSON.stringify(tmpList.value)).map(i => {
    const _text = `${i.text}\r\n`
    // 有笔记并且分隔符有内容时才换行
    const _split = i.note ? `${split}${split || noEmptyLine ? '\r\n' : ''}` : ''
    let textArr = i.note ? [_text, _split, `${i.note}\r\n`] : [_text, _split]
    // 如果笔记在摘录上方
    if (notePosition) textArr.reverse()
    let text = textArr.filter(i => i).join(noEmptyLine ? '' : '\r\n')
    i.text = handleTag(options, tag.value, text)
    i._text = handleTag(options, _tag, text)
    i.send = false
    return i
  })
  confirmCanEdit(options)
}
function confirmFirstParse (options) {
  const hasConfirm = localStorage.getItem('hasConfirm') || '0'
  if (hasConfirm === '0') {
    ElMessageBox.alert(
      '每次修改“书名”、“Tag”、“Tag 位置”、“分隔符”后需重新解析才会生效，重新解析会还原编辑后的内容。',
      '提示',
      {
        confirmButtonText: '知道了，不再提示',
        callback: () => {
          localStorage.setItem('hasConfirm', '1')
          parse(options)
        }
      }
    )
  } else {
    parse(options)
  }
}

function listUpdate (list) {
  tmpList.value = list
}
function updateTag (_tag) {
  tag.value = _tag
}
function reset () {
  contentList.value = []
  tmpList.value = []
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
