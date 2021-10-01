<template>
  <div class="left-bar pd-10">
    <div class="left-bar-form">
      <el-form
        :model="options"
        ref="form"
        label-width="80px"
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
                    选择 HTML / TXT 文件
                  </div>
                </div>
              </el-upload>
              <div class="how">
                <i class="el-icon-question"></i>
                <a
                  class="mr-10"
                  href="https://mp.weixin.qq.com/s/CPIYoGItJVWJGk30MoVNXA"
                  target="_blank"
                  >如何导出 HTML？</a
                >
                <el-tooltip effect="dark" placement="right">
                  <template #content>
                    <div >
                      <div class="pb-10">
                        将 Kindle 通过数据线连接至电脑
                      </div>
                      <div>
                        文件位于：Kindle根目录 - document - My Clippings.txt
                      </div>
                    </div>
                  </template>
                  <span class="pointer">My Clippings.txt 在哪？</span>
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
                  微信读书
                </div>
              </div>
            </el-form-item>
            <el-form-item label-width="0" v-else>
              <div class="pointer text-center border pd-10 radius">
                <el-tooltip effect="dark" placement="right">
                  <template #content>
                    <div slot="content" style="line-height: 1.5em">
                      由于 Apple Books 与微信读书笔记的笔记读取方式限制，只能通过安装应用读取。
                      <br />
                      <span style="color:#d96767;">下载文件夹下版本号最新的安装包</span>
                      <br />
                      文件访问密码：47if
                      <br />
                      或者去 <a style="color:#d96767;" href="https://github.com/Tit1e/kindle2Flomo/releases" target="_blank">GitHub</a> 下载
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
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item name="1">
                <template #title>
                  <div>
                    <i class="el-icon-set-up mr-4"></i>解析设置
                  </div>
                </template>
                <el-form-item label="Api">
                  <el-input
                    v-model="options.api"
                    type="password"
                    show-password
                    placeholder="API 采用本地存储"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Tag">
                  <div class="flex">
                    <div class="flex-1">
                      <el-input
                        v-model="options.tag"
                        :disabled="options.noTag"
                        clearable
                      ></el-input>
                    </div>
                    <div class="flex-1 pl-10">
                      <el-checkbox v-model="options.noTag">隐藏 tag</el-checkbox>
                    </div>
                  </div>
                </el-form-item>
                <template v-if="!options.noTag">
                  <el-form-item label="Tag 位置">
                    <el-switch
                      v-model="options.tagPosition"
                      active-text="顶部"
                      inactive-text="底部"
                    >
                    </el-switch>
                  </el-form-item>
                </template>
                <el-form-item label="笔记位置">
                  <el-switch
                    v-model="options.notePosition"
                    active-text="摘录上方"
                    inactive-text="摘录下方"
                  >
                  </el-switch>
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
                <el-form-item label="空行设置">
                  <div class="flex">
                    <div class="flex-1 pl-10">
                      <el-checkbox v-model="options.onlyTag" @change="onlyTagChange"
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
                <el-form-item label="列表顺序">
                  <el-switch
                    v-model="options.reverse"
                    active-text="倒序"
                    inactive-text="顺序"
                    @change="reverse"
                  >
                  </el-switch>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template #title>
                  <div>
                    <i class="el-icon-notebook-2 mr-4"></i>书籍列表
                  </div>
                </template>
                <template v-if="bookList.length">
                  <el-form-item label="书名">
                    <el-input v-model="options.title" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="书籍列表" label-width="0">
                    <el-radio-group class="book-list" v-model="options.book" size="small" @change="selectChange">
                      <el-radio v-for="item in bookList" :label="item.title" border>{{item.title}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-form>
    </div>
    <div class="left-bar-bottom">
      <el-button
        type="primary"
        size="mini"
        :disabled="!tmpList.length"
        @click="parse"
        >解析</el-button
      >
      <template v-if="disabledSend">
        <el-tooltip effect="dark" :disabled="false" content="请确保 API 已填写，需要导入的 MEMO 已勾选" placement="top">
          <span style="margin-left: 10px;">
            <el-button
              type="primary"
              :disabled="disabledSend"
              size="mini"
              >导入 Flomo</el-button
            >
          </span>
        </el-tooltip>
      </template>
      <template v-else>
        <el-button
        type="primary"
        size="mini"
        @click="submit"
        >导入 Flomo</el-button
      >
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, defineEmits, defineProps, computed, PropType} from 'vue'
import readSQLite from '@/utils/readSQLite.js'
import { ElLoading, ElMessage } from 'element-plus'
import { getNotebooklist, getBookMarkList, getReviewList } from '@/utils/weread.js'

interface Text {
  text: string,
  note: string,
  checked: boolean,
  isEdit: boolean
}
interface BookData {
  title: string,
  texts: Array<Text>,
  bookId: [string, number],
  loaded: boolean
}
const $emit = defineEmits(['update-tag', 'parse', 'submit', 'reverse', 'reset', 'list-update'])
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
const activeName = ref('1')
const bookList = ref<Array<BookData>>([])
const options = reactive({
  book: '',
  title: '',
  split: '',
  tag: 'kindle',
  api: '',
  noTag: false,
  reverse: false,
  // false 底部，true 顶部
  tagPosition: false,
  notePosition: false,
  noEmptyLine: true,
  onlyTag: false
})
function selectChange (val:String) {
  const data = bookList.value.find(i => (i.title === val))

  if(!data) return false

  if (data.bookId && !data.loaded) {
    const ReviewList = getReviewList(
      {
        bookId: data.bookId,
        listType: 11,
        maxIdx: 0,
        count: 0,
        listMode: 2,
        synckey: 0,
        mine: 1
      }
    )
    const BookMarkList = getBookMarkList(data.bookId)
    Promise.all([ReviewList, BookMarkList]).then(([reviewList, bookMarkList]) => {
      data.texts = [...reviewList, ...bookMarkList]
      data.loaded = true
      updateData(data)
    }).catch(e => {
      console.log(e)
    })
  }else{
    updateData(data)
  }
}

function handleBooksData (_bookList: Array<BookData>) {
  bookList.value = _bookList.reverse()
  const data = _bookList[0]
  if(data.bookId) selectChange(data.title)
  options.book = data.title
  activeName.value = '2'
  updateData(data)
}

function updateData (data: BookData) {
    const { title, texts, bookId } = data
    options.title = title
    $emit('list-update', texts)
    if (!texts.length && !bookId) {
      ElMessage.warning('未发现有效内容')
    } else {
      parse()
    }
  }
  // weread
  const showDialog = ref(true)
  const loading = ref(true)

function GetNotebooklist(){
  getNotebooklist().then(res => {
      showDialog.value = false
      loading.value = false
      handleBooksData(res)
    })
    .catch((err) => {
      loading.value = false
    })
}
function importWeRead () {
  loading.value = true
  showDialog.value = true
  GetNotebooklist()
}

// Apple Books
function importAppleBooks () {
  const loadingInstance = ElLoading.service({
    body: true,
    lock: true,
    text: '正在读取笔记'
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
function parse(){
  updateOptions()
  $emit('parse', options)
}
function submit(){
  $emit('submit', options.api)
}
function reverse () {
  $emit('reverse')
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
    reverse,
    noEmptyLine,
    onlyTag
  } = options
  const optionsData = {
    noTag,
    api,
    tag,
    split,
    tagPosition,
    reverse,
    noEmptyLine,
    onlyTag
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
</script>

<style lang="scss" scoped>
.left-bar{
  background-color: #e4f5ef;
  margin-top: -40px;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  user-select: none;
  &-form{
    height: 0px;
    flex: 1;
    overflow: hidden;
    padding-bottom: 10px;
    ::v-deep .el-form{
      height: 100%;
      &-item{
        &__label{
          padding-bottom: 4px;
        }
        &--mini {
          margin-bottom: 8px;
        }
      }
    }
    &-content{
      display: flex;
      flex-direction: column;
      height: 100%;
      &-top{
        .thired-import {
          justify-content: space-between;
          .flex-item {
            width: calc(50% - 5px);
            box-sizing: border-box;
          }
        }
      }
      &-body{
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
    ::v-deep .el-collapse{
      border: none;
      .el-collapse-item{
        &__header{
          background-color: #e4f5ef;
        }
        &__content{
          background-color: #e4f5ef;
          border: none;
          padding-bottom: 10px;
        }
      }
    }
    .book-list{
      ::v-deep .el-radio{
        background-color: #fff;
        width: 100%;
        margin: 0 0 10px 0;
        &__input{
          display: none;
        }
      }
      ::v-deep .el-radio.is-bordered + .el-radio.is-bordered{
        margin-left: 0px;
      }
    }
  }
  &-bottom{
    text-align: center;
    padding-top: 10px;
    box-shadow: 0 -10px 10px -16px rgba($color: #000000, $alpha: 0.4);
  }
}
</style>