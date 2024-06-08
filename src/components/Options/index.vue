<template>
  <div class="options radio">
    <div class="top">
      <el-form
        :model="options"
        ref="form"
        label-width="80px"
        size="mini"
        label-suffix="："
        label-position="top"
      >
        <el-form-item label="Api">
          <el-input
            v-model="options.api"
            type="password"
            show-password
            placeholder="API 采用本地存储"
          ></el-input>
        </el-form-item>
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
            <div class="upload-content radio flex pd-10 border">
              <i class="el-icon-folder-add"></i>
              <div class="el-upload__text">
                选择 HTML / TXT 文件
              </div>
            </div>
          </el-upload>
          <div class="how">
            <i class="el-icon-question"></i>
            <a
              href="https://mp.weixin.qq.com/s/CPIYoGItJVWJGk30MoVNXA"
              target="_blank"
              >如何导出 HTML？</a
            >
            <el-tooltip effect="dark" placement="right">
              <div slot="content">
                <div class="pb-10">
                  将 Kindle 通过数据线连接至电脑
                </div>
                <div>
                  文件位于：Kindle根目录 - document - My Clippings.txt
                </div>
              </div>
              <span class="pointer">My Clippings.txt 在哪？</span>
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item label-width="0" v-if="isElectron">
          <div class="flex thired-import">
            <div
              class="pointer text-center border pd-10 radio flex-item"
              @click="importAppleBooks"
            >
              Apple Books
            </div>
            <div
              class="pointer text-center border pd-10 radio flex-item"
              @click="importWeRead"
            >
              微信读书
            </div>
          </div>
        </el-form-item>
        <el-form-item label-width="0" v-else>
          <div class="pointer text-center border pd-10 radio">
            <el-tooltip effect="dark" placement="right">
              <div slot="content" style="line-height: 1.5em">
                由于 Apple Books 与微信读书笔记的笔记读取方式限制，只能通过安装应用读取。
                <br />
                <span style="color:#d96767;">下载文件夹下版本号最新的安装包</span>
                <br />
                文件访问密码：47if
                <br />
                或者去 <a style="color:#d96767;" href="https://github.com/Tit1e/kindle2Flomo/releases" target="_blank">GitHub</a> 下载
              </div>
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
        <el-form-item label="选择书籍" v-if="bookList.length">
          <el-select v-model="options.book" @change="selectChange">
            <el-option
              v-for="(item, index) in bookList"
              :key="item.index"
              :label="item.title"
              :value="item.title"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="书名">
          <el-input v-model="options.title" clearable></el-input>
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
        <el-form-item label="">
          <span slot="label">
            <el-tooltip class="item" effect="dark" placement="left">
              <div slot="content" style="width:200px;line-height: 1.5em;">
                如导入内容含有自己添加的笔记，请使用移动端 APP 导出 HTML 或 My
                Clippings.txt
              </div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
            笔记位置：
          </span>
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
            >分隔符<b class="highlight">仅在有笔记时生效</b
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
      </el-form>
    </div>
    <div class="bottom">
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
    <el-dialog class="login-dialog" :visible.sync="showDialog" :close-on-click-modal="false" width="270px">
      <div class="iframe-box" v-loading="loading">
        <iframe
          v-if="showDialog"
          src="https://weread.qq.com/#login"
          frameborder="0"
        ></iframe>
      </div>
      <div class="text-center" v-show="!loading">
        <el-button type="text" style="color: #999999;" @click="showDialog = false">取消</el-button>
        <el-button type="text" @click="getNotebooklist">我已登录</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import readFile from '@/utils/readFile.js'
import paresClip from '@/utils/paresClip.js'
import readSQLite from '@/utils/readSQLite.js'
import { Loading } from 'element-ui'
import { getNotebooklist, getBookMarkList, getReviewList } from '@/utils/weread.js'
import axios from 'axios'
export default {
  name: 'Options',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    tmpList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      options: {
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
      },
      tag: '',
      bookList: [],
      isElectron: !!process.env.IS_ELECTRON,
      showDialog: false,
      cookie: null,
      loading: false,
    }
  },
  watch: {
    options: {
      handler () {
        this.computedTag()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    checkedMemo () {
      return this.list.filter(i => i.checked)
    },
    disabledSend () {
      return !this.checkedMemo.length || !this.options.api
    }
  },
  created () {
    this.setOptions()
  },
  mounted () {
    this.$nextTick(() => {
      this.listenFile()
    })
  },
  methods: {
    onlyTagChange (val) {
      // 只在 tag 前后时，禁用空行
      if (val) {
        this.options.noEmptyLine = true
      }
    },
    getNotebooklist(){
      getNotebooklist()
        .then(res => {
          this.showDialog = false
          this.loading = false
          this.handleBooksData(res)
        })
        .catch((err) => {
          this.loading = false
        })
    },
    importWeRead () {
      this.loading = true
      this.showDialog = true
      this.getNotebooklist()
    },
    importAppleBooks () {
      const loadingInstance = Loading.service({
        body: true,
        lock: true,
        text: '正在读取笔记'
      })
      readSQLite()
        .then(res => {
          try {
            setTimeout(() => {
              this.handleBooksData(res)
              loadingInstance.close()
            }, 1500)
          } catch (error) {
            loadingInstance.close()
          }
        })
        .catch(e => {
          this.$message.error(e)
          loadingInstance.close()
        })
    },
    handleBooksData (bookList) {
      this.bookList = bookList.reverse()
      const data = bookList[0]
      if(data.bookId) this.selectChange(data.title)
      this.options.book = data.title
      this.updateData(data)
    },
    selectChange (val) {
      const data = this.bookList.find(i => i.title === val)
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
          this.updateData(data)
        }).catch(e => {
          console.log(e)
        })
      }else{
        this.updateData(data)
      }
    },
    parse () {
      this.updateOptions()
      this.$emit('parse', this.options)
    },
    submit () {
      this.$emit('submit', this.options.api)
    },
    reverse () {
      this.$emit('reverse')
    },
    setOptions () {
      const options = JSON.parse(localStorage.getItem('options'))
      this.$set(this, 'options', {
        ...this.options,
        ...options
      })
    },
    reset () {
      this.bookList = []
      this.$emit('reset')
    },
    listenFile () {
      document
        .querySelector('#fileSelect input')
        .addEventListener('change', e => {
          this.reset()
          this.$nextTick(() => {
            const file = e.target.files[0]
            const ext = file.name
              .split('.')
              .pop()
              .toLowerCase()
            const reader = new FileReader()
            reader.onload = () => {
              if (ext === 'txt') {
                this.bookList = paresClip(reader.result)
                try {
                  const data = this.bookList[0]
                  this.options.book = data.title
                  this.updateData(data)
                } catch (error) {}
              }
              if (ext === 'html') {
                const data = readFile(reader.result)
                this.updateData(data)
              }
            }
            reader.readAsText(file)
          })
        })
    },
    updateData (data) {
      const { title, texts, bookId } = data
      this.options.title = title
      this.$emit('list-update', texts)
      if (!texts.length && !bookId) {
        this.$message.warning('未发现有效内容')
      } else {
        this.parse()
      }
    },
    updateOptions () {
      const {
        noTag,
        api,
        tag,
        split,
        tagPosition,
        reverse,
        noEmptyLine,
        onlyTag
      } = this.options
      const options = {
        noTag,
        api,
        tag,
        split,
        tagPosition,
        reverse,
        noEmptyLine,
        onlyTag
      }
      localStorage.setItem('options', JSON.stringify(options))
    },
    computedTag () {
      let _tag = ''
      const { tag, title, noTag } = this.options
      if (noTag) {
        this.$emit('update-tag', _tag)
        this.tag = _tag
        return false
      }
      if (!tag) {
        _tag = `#${title}`
      } else {
        _tag = `#${tag}/${title}`
      }
      this.$emit('update-tag', _tag)
      this.tag = _tag
    }
  }
}
</script>

<style lang="scss" scoped>
.options {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  width: 300px;
  background: #e4f5ef;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  .top {
    flex-grow: 1;
    overflow: auto;
    box-sizing: border-box;
    .how {
      color: inherit;
      font-size: 12px;
      i {
        margin-right: 4px;
      }
      a {
        margin-right: 4px;
        color: inherit;
      }
    }
    .el-form-item--mini {
      margin-bottom: 10px;
    }
    .thired-import {
      justify-content: space-between;
      .flex-item {
        width: calc(50% - 5px);
        box-sizing: border-box;
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
  }
  .bottom {
    text-align: center;
    padding-top: 10px;
    box-shadow: 0 -10px 10px -16px rgba($color: #000000, $alpha: 0.4);
  }

  .select {
    width: 100px;
    height: 100px;
    background-color: #000;
    display: block;
    cursor: pointer;
    input {
      display: none;
    }
  }
  .login-dialog {
    ::v-deep .el-dialog__header {
      display: none !important;
    }
    ::v-deep .el-dialog__body {
      padding: 10px !important;
    }
  }
  .iframe-box {
    width: 100%;
    height: 300px;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
