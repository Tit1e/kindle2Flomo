<template>
  <div class="left-bar" :class="{ 'pt-10': !isElectron, electron: isElectron }">
    <div class="left-bar-form">
      <el-form
        :model="options"
        ref="form"
        size="mini"
        label-suffix="："
        label-position="top"
      >
        <div class="left-bar-form-content">
          <div class="left-bar-form-content-top">
            <el-form-item label-width="0">
              <el-upload
                id="fileSelect"
                style="width: 100%"
                :show-file-list="false"
                :multiple="false"
                action=""
                :auto-upload="false"
                accept=".html,.txt,.json"
              >
                <div class="upload-content radius flex pd-10 border">
                  <i class="el-icon-folder-add"></i>
                  <div class="el-upload__text">
                    {{ t('upload-file') }}
                  </div>
                </div>
              </el-upload>
              <div class="how">
                <i class="el-icon-question"></i>
                <el-tooltip effect="dark" placement="right">
                  <template #content>
                    <div>
                      <div class="pb-10">
                        <span class="bold text-highlight">JSON:</span> KOReader 导出的 JSON 文件
                      </div>
                      <div class="pb-10">
                        <span class="bold text-highlight">HTML:</span> Kindle 或 Kindle App 导出的 HTML 文件
                      </div>
                      <div class="pb-16">
                        <span class="bold text-highlight">TXT:</span> Kindle 的 My Clippings.txt 文件
                      </div>
                      <div class="pb-6 bold text-highlight">
                        My Clippings.txt 在哪？
                      </div>
                      <div class="pb-16">
                        <div class="pb-4">
                          将 Kindle 通过数据线连接至电脑
                        </div>
                        文件位于：Kindle根目录 - document - My Clippings.txt
                      </div>
                      <div class="link pointer underline bold text-highlight" @click="openUrl('https://mp.weixin.qq.com/s/CPIYoGItJVWJGk30MoVNXA')">
                        {{ t('how-export') }}
                      </div>
                    </div>
                  </template>
                  <span class="pointer">{{ t('questions-and-answers') }}</span>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label-width="0" v-if="isElectron">
              <div class="flex thired-import">
                <div
                  class="pointer text-center border pd-10 radius flex-item"
                  @click="importAppleBooks"
                >
                  Apple Books
                </div>
                <div
                  class="pointer text-center border pd-10 radius flex-item"
                  @click="importWeRead"
                >
                  {{ t('weread') }}
                </div>
              </div>
            </el-form-item>
            <el-form-item label-width="0" v-else>
              <div class="pointer text-center border pd-10 radius">
                <el-tooltip effect="dark" placement="right">
                  <template #content>
                    <div slot="content" style="line-height: 1.5em">
                      <b>点击下载应用</b>
                      <br>
                      由于 Apple Books 与微信读书笔记的读取方式限制，
                      <br>
                      必须安装客户端才能使用。
                    </div>
                  </template>
                  <a
                    class="link"
                    href="https://github.com/Tit1e/kindle2Flomo/releases"
                    target="_blank"
                  >
                    从 Apple Books / 微信读书 导入
                  </a>
                </el-tooltip>
              </div>
              <a
                class="how link"
                href="https://evolly.one/2021/05/30/158-mac-handle-bad-app/"
                target="_blank"
              >
                Send2flomo.app 打不开？
              </a>
            </el-form-item>
          </div>
          <div class="left-bar-form-content-body">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item name="1">
                <template #title>
                  <div>
                    <i class="el-icon-set-up mr-4"></i>{{ t('parse-options') }}
                  </div>
                </template>
                <el-divider>{{ t('api-options') }}</el-divider>
                <el-form-item label="" label-width="0px">
                  <el-input
                    v-model="options.api"
                    type="password"
                    show-password
                    placeholder="API 采用本地存储"
                  ></el-input>
                </el-form-item>
                <el-divider>{{ t('tag-options') }}</el-divider>
                <el-form-item label="Tag">
                  <div class="flex">
                    <div class="flex-1">
                      <el-input
                        v-model="options.tag"
                        :disabled="options.noTag"
                        placeholder="Tag 名称"
                        clearable
                      ></el-input>
                    </div>
                    <div class="flex-1 pl-10">
                      <el-checkbox v-model="options.noTag">{{
                        t('hide-tag')
                      }}</el-checkbox>
                    </div>
                  </div>
                </el-form-item>
                <template v-if="!options.noTag">
                  <el-form-item :label="t('position-of-tag')">
                    <el-radio-group v-model="options.tagPosition">
                      <el-radio-button :label="true">{{
                        t('top')
                      }}</el-radio-button>
                      <el-radio-button :label="false">{{
                        t('bottom')
                      }}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="空行">
                    <el-radio-group v-model="options.noEmptyLine">
                      <el-radio-button :label="false">{{
                        t('on')
                      }}</el-radio-button>
                      <el-radio-button :label="true">{{
                        t('off')
                      }}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </template>
                <el-divider>{{ t('notes-options') }}</el-divider>
                <el-form-item label="位置">
                  <el-radio-group v-model="options.notePosition">
                    <el-radio-button :label="true">摘录上方</el-radio-button>
                    <el-radio-button :label="false">摘录下方</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="分隔符">
                  <el-input
                    v-model="options.split"
                    placeholder="为空以空行填充，此空行无法禁用"
                    clearable
                  ></el-input>
                  <span class="fz-12"
                    ><b class="highlight">仅在有笔记时生效</b
                    >，且总在笔记与摘录之间</span
                  >
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template #title>
                  <div>
                    <i class="el-icon-notebook-2 mr-4"></i>{{ t('book-list') }}
                  </div>
                </template>
                <template v-if="bookList.length">
                  <el-form-item :label="t('book-name')">
                    <el-input v-model="options.book" @blur="updateBook"></el-input>
                  </el-form-item>
                  <el-form-item :label="t('book-list')" label-width="0">
                    <div class="list-wrap">
                      <el-radio-group
                        class="book-list"
                        v-model="options.title"
                        size="small"
                        @change="selectChange"
                      >
                        <el-radio
                          v-for="item in bookList"
                          :key="item.uuid"
                          :label="item.title"
                          border
                          >{{ item.title }}</el-radio
                        >
                      </el-radio-group>
                    </div>
                  </el-form-item>
                </template>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-form>
    </div>
    <div class="left-bar-bottom">
      <template v-if="disabledSend">
        <el-tooltip
          effect="dark"
          :disabled="false"
          :content="
            importDisabled
              ? '导入数量已达 100 条限额'
              : '请确保 API 已填写，需要导入的 MEMO 已勾选'
          "
          placement="top"
        >
          <el-button type="primary" :disabled="disabledSend" size="mini">{{
            t('import')
          }}</el-button>
        </el-tooltip>
      </template>
      <template v-else>
        <el-button type="primary" size="mini" @click="submit">{{
          t('import')
        }}</el-button>
      </template>
    </div>
    <!-- 微信登陆弹窗 -->
    <el-dialog
      custom-class="login-dialog"
      v-model="showDialog"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
      width="270px"
    >
      <div class="iframe-box" v-loading="loading">
        <iframe
          v-if="showDialog"
          src="https://weread.qq.com/#login"
          frameborder="0"
        ></iframe>
      </div>
      <div class="text-center" v-show="!loading">
        <el-button
          type="text"
          style="color: #999999;"
          @click="showDialog = false"
          >取消</el-button
        >
        <el-button type="text" @click="GetNotebooklist">我已登录</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import readFile from '@/utils/readFile.js'
import readJSON from '@/utils/readJSON.js'
import paresClip from '@/utils/paresClip.js'
import readSQLite from '@/utils/readSQLite.js'
import { dexiePut } from '@/db/dexie.js'
import { ref, reactive, computed, PropType, onMounted, watch } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import init from '@/utils/init.js'
import { openUrl } from '@/utils/utils.js'

import {
  getNotebooklist,
  getBookMarkList,
  getReviewList
} from '@/utils/weread.js'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
interface Text {
  text: string
  note: string
  checked: boolean
}
interface BookData {
  title: string
  texts: Array<Text>
  bookId?: [string, number]
  loaded?: boolean
  book: string
}
const $emit = defineEmits([
  'update-tag',
  'parse',
  'submit',
  'list-update'
])
const store = useStore()
const selectedList = computed(() => store.getters.selectedList)
const importDisabled = computed(() => store.getters.importCount >= 100)
const bookList = computed(() => store.getters.bookList)
// 图书列表更新自动选中第一项
watch(() => bookList.value[0], (val, old = {}) => {
  if(val && (val.title !== old.title)) {
    updateData(val)
  }
})
// 更新图书名称
function updateBook(e){
  let bookData = bookList.value.find(item => item.title === options.title)
  if(bookData){
    bookData = {
      ...bookData,
      book: e.target.value
    }
    delete bookData.texts
  }
  store.commit('UPDATE_BOOK', bookData)
  dexiePut(bookData, 'books')
}

const isElectron = store.getters.isElectron
let options = reactive({
  book: '',
  title: '',
  split: '',
  tag: 'kindle',
  api: '',
  noTag: false,
  // false 底部，true 顶部
  tagPosition: false,
  notePosition: false,
  noEmptyLine: true,
})

let activeName = ref('1')

watch(
  () => activeName.value,
  val => {
    window.localStorage.setItem('activeName', val)
  }
)

const disabledSend = computed(
  () => !selectedList.value.length || !options.api || importDisabled.value
)

function setOptions () {
  const _options = JSON.parse(localStorage.getItem('options') || '{}')
  options = reactive({
    ...options,
    ..._options
  })
  activeName.value = window.localStorage.getItem('activeName') || '1'
}

setOptions()

watch(
  () => options,
  () => {
    computedTag()
    parse()
  },
  { deep: true }
)

async function getWereadNotes(books, needSort = true, loadingInstance) {
  const _books = books.reverse()
  const {bookId, title} = _books[0]
  const ReviewList = getReviewList({
    title,
    bookId,
    listType: 11,
    maxIdx: 0,
    count: 0,
    listMode: 2,
    synckey: 0,
    mine: 1
  })
  const BookMarkList = getBookMarkList(bookId, title)
  try {
    await Promise.all([ReviewList, BookMarkList])
    if(!needSort){
      await init(bookList.value.map(item => item.title).reverse(), true)
    }else{
      await init(_books.map(item => item.title), needSort)
    }
    loadingInstance.close()
  } catch (error) {
    console.log(error)
    if(error.errcode === -2012){
      importWeRead()
    }
    loadingInstance.close()
  }
}

function selectChange (val: String) {
  const data = bookList.value.find(i => i.title === val)
  if (!data) return false

  if (data.bookId) {
    const loadingInstance = Loading()
    getWereadNotes([data], false, loadingInstance)
  }
  updateData(data)
}

function handleBooksData (_bookList: Array<BookData>) {
  store.commit('SET_BOOK_LIST', _bookList)
  const data = _bookList[0]
  if(data){
    // 微信读书获取第一本书的内容
    if (data.bookId) selectChange(data.title)
    updateData(data)
  }
}

function updateData (data: BookData) {
  const { title, texts, bookId, book } = data
  options.title = title
  options.book = book
  computedTag()
  $emit('list-update', { list: texts, options })
  parse(true)
}
// weread
const showDialog = ref(false)
const loading = ref(false)
function GetNotebooklist (loadingInstance) {
  getNotebooklist()
    .then(books => {
      showDialog.value = false
      loading.value = false
      getWereadNotes(books, true, loadingInstance)
    })
    .catch(err => {
      console.log(err)
      loading.value = false
      loadingInstance.close()
    })
}
function importWeRead () {
  showDialog.value = true
  loading.value = true
  const loadingInstance = Loading()
  GetNotebooklist(loadingInstance)
}

function Loading (options = {}) {
  return ElLoading.service({
    body: true,
    lock: true,
    text: t('reading-notes'),
    ...options
  })
}

// Apple Books
function importAppleBooks () {
  const loadingInstance = Loading()
  readSQLite()
    .then(() => {
      loadingInstance.close()
    }).catch(e => {
      ElMessage.error(e)
      loadingInstance.close()
    })
}
function parse (showBookList: boolean = false) {
  if (showBookList) {
    activeName.value = '2'
  }
  updateOptions()
  $emit('parse', options)
}
function submit () {
  $emit('submit', options.api)
}
function updateOptions () {
  const { noTag, api, tag, split, tagPosition, noEmptyLine } = options
  const optionsData = {
    noTag,
    api,
    tag,
    split,
    tagPosition,
    noEmptyLine,
  }
  localStorage.setItem('options', JSON.stringify(optionsData))
}
const Tag = ref('')
function computedTag () {
  let _tag = ''
  const { tag, book, noTag } = options
  if (noTag) {
    $emit('update-tag', _tag)
    Tag.value = _tag
    return
  }
  if (!tag) {
    _tag = `#${book}`
  } else {
    _tag = `#${tag}/${book}`
  }
  $emit('update-tag', _tag)
  Tag.value = _tag
}

function listenFile () {
  document.querySelector('#fileSelect input').addEventListener('change', e => {
    const loadingInstance = Loading()
    const file = e.target.files[0]
    const ext = file.name
      .split('.')
      .pop()
      .toLowerCase()
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        if (ext === 'txt') {
          await paresClip(reader.result)
        }
        if (ext === 'html') {
          await readFile(reader.result)
        }
        if (ext === 'json') {
          await readJSON(reader.result)
        }
        loadingInstance.close()
        // updateData(data)
      } catch (error) {
        console.log(`txt 解析出错：${error}`)
        loadingInstance.close()
      }
    }
    reader.readAsText(file)
  })
}
onMounted(() => {
  listenFile()
})
</script>

<style lang="scss" scoped>
.left-bar {
  background-color: #e4f5ef;
  display: flex;
  flex-direction: column;
  user-select: none;
  padding: 10px;
  &.electron {
    margin-top: -40px;
    padding-top: 40px;
  }
  &-form {
    height: 0px;
    flex: 1;
    overflow: hidden;
    padding-bottom: 10px;
    :deep(.el-form) {
      height: 100%;
      .el-form-item {
        &__label {
          padding-bottom: 4px;
        }
        &--mini {
          margin-bottom: 8px;
        }
      }
    }
    &-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      &-top {
        .thired-import {
          justify-content: space-between;
          .flex-item {
            width: calc(50% - 5px);
            box-sizing: border-box;
          }
        }
      }
      &-body {
        height: 0;
        flex: 1;
        overflow: auto;
      }
    }
    #fileSelect {
      box-sizing: border-box;
      width: 100%;
      .upload-content {
        font-size: 14px;
        align-items: center;
        justify-content: center;
        .el-icon-folder-add {
          font-size: 1.4em;
          margin-right: 10px;
        }
      }
    }
    .how {
      color: inherit;
      font-size: 12px;
      i {
        margin-right: 4px;
      }
      a {
        margin-right: 10px;
        color: inherit;
      }
    }
    :deep(.el-divider) {
      .el-divider__text {
        background-color: #e4f5ef;
      }
    }
    :deep(.el-collapse) {
      border: none;
      .el-collapse-item {
        &__wrap {
          background-color: #e4f5ef;
        }
        &__header {
          background-color: #e4f5ef;
        }
        &__content {
          background-color: #e4f5ef;
          border: none;
          padding-bottom: 10px;
        }
      }
    }
    .list-wrap {
      max-height: calc(100vh - 446px);
      overflow: scroll;
      margin-bottom: -16px;
      .book-list {
        :deep(.el-radio) {
          background-color: #fff;
          width: 100%;
          margin: 0 0 10px 0;
          .el-radio__label {
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
          }
          .el-radio__input {
            display: none;
          }
        }
        :deep(.el-radio.is-bordered){
          border: none;
        }
        :deep(.el-radio.is-bordered + .el-radio.is-bordered) {
          margin-left: 0px;
        }
        :deep(.el-radio.is-bordered.is-checked){
          background-color: var(--el-color-primary);
          .el-radio__label{
            color: #fff;
          }
        }
      }
    }
  }
  &-bottom {
    text-align: center;
    padding-top: 10px;
    box-shadow: 0 -10px 10px -16px rgba($color: #000000, $alpha: 0.4);
  }
}
</style>
