<template>
  <div class="left-bar pd-10">
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
                accept=".html,.txt"
              >
                <div class="upload-content radius flex pd-10 border">
                  <i class="el-icon-folder-add"></i>
                  <div class="el-upload__text">
                    {{t('upload-file')}}
                  </div>
                </div>
              </el-upload>
              <div class="how">
                <i class="el-icon-question"></i>
                <a
                  class="mr-10"
                  href="https://mp.weixin.qq.com/s/CPIYoGItJVWJGk30MoVNXA"
                  target="_blank"
                  >{{ t('how-export') }}</a
                >
                <el-tooltip effect="dark" placement="right">
                  <template #content>
                    <div>
                      <div class="pb-10">
                        将 Kindle 通过数据线连接至电脑
                      </div>
                      <div>
                        文件位于：Kindle根目录 - document - My Clippings.txt
                      </div>
                    </div>
                  </template>
                  <span class="pointer">{{ t('where-is--my-clippings') }}</span>
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
                      由于 Apple Books
                      与微信读书笔记的笔记读取方式限制，只能通过安装应用读取。
                      <br />
                      <span style="color:#d96767;"
                        >下载文件夹下版本号最新的安装包</span
                      >
                      <br />
                      文件访问密码：47if
                      <br />
                      或者去
                      <a
                        style="color:#d96767;"
                        href="https://github.com/Tit1e/kindle2Flomo/releases"
                        target="_blank"
                        >GitHub</a
                      >
                      下载
                    </div>
                  </template>
                  <a href="https://wwr.lanzoui.com/b02c3nkyf" target="_blank">
                    从 Apple Books / 微信读书 导入
                  </a>
                </el-tooltip>
              </div>
              <a
                class="how"
                href="https://evolly.one/2021/05/30/158-mac-handle-bad-app/"
                target="_blank"
              >
                Kindle2Flomo.app 打不开？
              </a>
            </el-form-item>
          </div>
          <div class="left-bar-form-content-body">
            <el-collapse v-model="options.activeName" accordion>
              <el-collapse-item name="1">
                <template #title>
                  <div>
                    <i class="el-icon-set-up mr-4"></i>{{ t('parse-options') }}
                  </div>
                </template>
                <el-divider>{{t('api-options')}}</el-divider>
                <el-form-item label="" label-width="0px">
                  <el-input
                    v-model="options.api"
                    type="password"
                    show-password
                    placeholder="API 采用本地存储"
                  ></el-input>
                </el-form-item>
                <el-divider>{{t('tag-options')}}</el-divider>
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
                      <el-radio-button :label="true">{{t('top')}}</el-radio-button>
                      <el-radio-button :label="false">{{t('bottom')}}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </template>
                <el-form-item label="空行">
                  <div class="flex">
                    <div class="flex-1 pl-10">
                      <el-checkbox
                        v-model="options.onlyTag"
                        @change="onlyTagChange"
                        >仅 Tag 前 / 后</el-checkbox
                      >
                    </div>
                    <div class="flex-1 pl-10">
                      <el-checkbox
                        v-model="options.noEmptyLine"
                        :disabled="options.onlyTag"
                        >禁用</el-checkbox
                      >
                    </div>
                  </div>
                </el-form-item>
                <el-divider>{{t('notes-options')}}</el-divider>
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
                  <div><i class="el-icon-notebook-2 mr-4"></i>{{t('book-list')}}</div>
                </template>
                <template v-if="bookList.length">
                  <el-form-item :label="t('book-name')">
                    <el-input v-model="options.title"></el-input>
                  </el-form-item>
                  <el-form-item :label="t('book-list')" label-width="0">
                    <div class="list-wrap">
                      <el-radio-group
                        class="book-list"
                        v-model="options.book"
                        size="small"
                        @change="selectChange"
                      >
                        <el-radio
                          v-for="item in bookList"
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
          content="请确保 API 已填写，需要导入的 MEMO 已勾选"
          placement="top"
        >
          <span style="margin-left: 10px;">
            <el-button type="primary" :disabled="disabledSend" size="mini"
              >{{t('import')}}</el-button
            >
          </span>
        </el-tooltip>
      </template>
      <template v-else>
        <el-button type="primary" size="mini" @click="submit"
          >{{t('import')}}</el-button
        >
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
        <iframe v-if="showDialog" src="https://weread.qq.com/#login" frameborder="0"></iframe>
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
import paresClip from '@/utils/paresClip.js'
import readSQLite from '@/utils/readSQLite.js'
import { ref, reactive, computed, PropType, onMounted, watch } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import {
  getNotebooklist,
  getBookMarkList,
  getReviewList
} from '@/utils/weread.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
interface Text {
  text: string
  note: string
  checked: boolean
  isEdit: boolean
}
interface BookData {
  title: string
  texts: Array<Text>
  bookId?: [string, number]
  loaded?: boolean
}
const $emit = defineEmits([
  'update-tag',
  'parse',
  'submit',
  'reset',
  'list-update'
])
const props = defineProps({
  list: {
    type: Array as PropType<Text[]>,
    default: () => []
  },
  tmpList: {
    type: Array as PropType<Text[]>,
    default: () => []
  }
})


const checkedMemo = computed(() => props.list.filter(i => i.checked))
const disabledSend = computed(() => !checkedMemo.value.length || !options.api)
const isElectron = ref(!!process.env.IS_ELECTRON)
const bookList = ref<Array<BookData>>([])
let options = reactive({
  activeName: '1',
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
  onlyTag: false
})

function setOptions () {
  const _options = JSON.parse(localStorage.getItem('options') || '{}')
  options = reactive({
    ...options,
    ..._options
  })
}

setOptions()


watch(
  () => options,
  () => {
    computedTag()
    parse()
  },
  {deep: true}
)
function selectChange (val: String) {
  const data = bookList.value.find(i => i.title === val)

  if (!data) return false

  if (data.bookId && !data.loaded) {
    const ReviewList = getReviewList({
      bookId: data.bookId,
      listType: 11,
      maxIdx: 0,
      count: 0,
      listMode: 2,
      synckey: 0,
      mine: 1
    })
    const BookMarkList = getBookMarkList(data.bookId)
    Promise.all([ReviewList, BookMarkList])
      .then(([reviewList, bookMarkList]) => {
        data.texts = [...reviewList, ...bookMarkList]
        data.loaded = true
        updateData(data)
      })
      .catch(e => {
        console.log(e)
      })
  } else {
    updateData(data)
  }
}

function handleBooksData (_bookList: Array<BookData>) {
  bookList.value = _bookList.reverse()
  const data = _bookList[0]
  if (data.bookId) selectChange(data.title)
  options.book = data.title
  updateData(data)
}

function updateData (data: BookData) {
  const { title, texts, bookId } = data
  options.title = title
  $emit('list-update', texts)
  if (!texts.length && !bookId) {
    ElMessage.warning('未发现有效内容')
  } else {
    parse(true)
  }
}
// weread
const showDialog = ref(false)
const loading = ref(false)

function GetNotebooklist () {
  getNotebooklist()
    .then(res => {
      showDialog.value = false
      loading.value = false
      handleBooksData(res)
    })
    .catch(err => {
      loading.value = false
    })
}
function importWeRead () {
  showDialog.value = true
  loading.value = true
  setTimeout(GetNotebooklist, 300)
}

// Apple Books
function importAppleBooks () {
  const loadingInstance = ElLoading.service({
    body: true,
    lock: true,
    text: t('reading-notes')
  })
  readSQLite()
    .then(res => {
      try {
        setTimeout(() => {
          handleBooksData(res)
          loadingInstance.close()
        }, 1500)
      } catch (error) {
        loadingInstance.close()
      }
    })
    .catch(e => {
      ElMessage.error(e)
      loadingInstance.close()
    })
}
function parse (showBookList: boolean = false) {
  if(showBookList){
    options.activeName = '2'
  }
  updateOptions()
  $emit('parse', options)
}
function submit () {
  $emit('submit', options.api)
}
function onlyTagChange (val: Boolean) {
  // 只在 tag 前后时，禁用空行
  if (val) {
    options.noEmptyLine = true
  }
}
function updateOptions () {
  const {
    noTag,
    api,
    tag,
    split,
    tagPosition,
    noEmptyLine,
    onlyTag,
    activeName
  } = options
  const optionsData = {
    noTag,
    api,
    tag,
    split,
    tagPosition,
    noEmptyLine,
    onlyTag,
    activeName
  }
  localStorage.setItem('options', JSON.stringify(optionsData))
}
const Tag = ref('')
function computedTag () {
  let _tag = ''
  const { tag, title, noTag } = options
  if (noTag) {
    $emit('update-tag', _tag)
    Tag.value = _tag
    return false
  }
  if (!tag) {
    _tag = `#${title}`
  } else {
    _tag = `#${tag}/${title}`
  }
  $emit('update-tag', _tag)
  Tag.value = _tag
}
function reset () {
  bookList.value = []
  $emit('reset')
}
function listenFile () {
  document.querySelector('#fileSelect input')
    .addEventListener('change', e => {
      reset()
        const file = e.target.files[0]
        const ext = file.name
          .split('.')
          .pop()
          .toLowerCase()
        const reader = new FileReader()
        reader.onload = () => {
          if (ext === 'txt') {
            bookList.value = paresClip(reader.result)
            try {
              const data = bookList.value[0]
              options.book = data.title
              updateData(data)
            } catch (error) {}
          }
          if (ext === 'html') {
            const data = readFile(reader.result)
            updateData(data)
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
  margin-top: -40px;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  user-select: none;
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
    :deep(.el-divider){
      .el-divider__text{
        background-color: #e4f5ef;
      }
    }
    :deep(.el-collapse) {
      border: none;
      .el-collapse-item {
        &__wrap{
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
    .list-wrap{
      max-height: calc(100vh - 446px);
      overflow: scroll;
      margin-bottom: -16px;
      .book-list {
        :deep(.el-radio) {
          background-color: #fff;
          width: 100%;
          margin: 0 0 10px 0;
          .el-radio__label{
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
          }
          .el-radio__input {
            display: none;
          }
        }
        :deep(.el-radio.is-bordered + .el-radio.is-bordered) {
          margin-left: 0px;
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
