<template>
  <the-head class="the-head" />
  <div class="content-wrap">
    <left-bar
      class="left-bar"
      :list="contentList"
      :tmp-list="tmpList"
      @submit="submit"
      @parse="confirmFirstParse"
      @reverse="reverseList"
      @list-update="listUpdate"
      @update-tag="updateTag"
      @reset="reset"
    />
    <right-content class="right-content" :content-list="contentList" />
  </div>
</template>

<script lang="ts" setup>
import TheHead from '@/components/TheHead'
import LeftBar from '@/components/LeftBar'
import RightContent from '@/components/RightContent'
import { ref, toRefs, toRef, reactive, computed, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
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
function submit (url: string = '') {
  loading.value = true
  index.value = 0
  // sendMemo(url, checkedMemo, index)
}
function sendMemo () {}
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
  await nextTick()
  contentList.value = JSON.parse(JSON.stringify(tmpList.value)).map(i => {
    const _text = `${i.text}\r\n`
    // 有笔记并且分隔符有内容时才换行
    const _split = i.note ? `${split}${split || noEmptyLine ? '\r\n' : ''}` : ''
    let textArr = i.note ? [_text, _split, `${i.note}\r\n`] : [_text, _split]
    // 如果笔记在摘录上方
    if (notePosition) textArr.reverse()
    let text = textArr.filter(i => i).join(noEmptyLine ? '' : '\r\n')
    if (!noTag) {
      // tag 位置在上方
      if (tagPosition) {
        // 在上方时空行加在 tag 后
        text =
          (onlyTag
            ? `${tag.value}\r\n\r\n`
            : noEmptyLine
            ? `${tag.value}\r\n`
            : `${tag.value}\r\n\r\n`) + text
      } else {
        // 在上方时空行加在 tag 前
        text =
          text + (onlyTag ? `\r\n${tag.value}` : noEmptyLine ? tag.value : `\r\n${tag.value}`)
      }
    }
    i.text = text
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
function reverseList () {
  contentList.value.reverse()
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
