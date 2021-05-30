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
          <div class="pointer text-center border pd-10 radio" @click="importNotes">
            从 Apple Books 导入
          </div>
        </el-form-item>
        <el-form-item label-width="0" v-else>
          <div class="pointer text-center border pd-10 radio">
            <el-tooltip effect="dark" placement="right">
              <div slot="content">
                由于 Apple Books 笔记存储类型限制，只能通过安装应用读取。
                <br>
                文件访问密码：47if
              </div>
              <a href="https://wwr.lanzoui.com/b02c3nkyf" target="_blank">
                从 Apple Books 导入
              </a>
            </el-tooltip>
          </div>
          <a class="how" href="https://evolly.one/2021/05/30/158-mac-handle-bad-app/" target="_blank">
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
            <el-input v-model="options.split" placeholder="为空以空行填充，此空行无法禁用" clearable></el-input>
          <span class="fz-12">分隔符<b class="highlight">仅在有笔记时生效</b>，且总在笔记与摘录之间</span>
        </el-form-item>
        <el-form-item label="空行设置">
          <div class="flex">
            <div class="flex-1 pl-10">
              <el-checkbox v-model="options.onlyTag" @change="onlyTagChange">仅 Tag 前 / 后</el-checkbox>
            </div>
            <div class="flex-1 pl-10">
              <el-checkbox v-model="options.noEmptyLine" :disabled="options.onlyTag">禁用</el-checkbox>
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
      <el-button
        type="primary"
        :disabled="disabledSend"
        size="mini"
        @click="submit"
        >导入 Flomo</el-button
      >
    </div>
  </div>
</template>

<script>
import readFile from '@/utils/readFile.js'
import paresClip from '@/utils/paresClip.js'
import readSQLite from '@/utils/readSQLite.js'
import { Loading } from 'element-ui';
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
      isElectron: !!process.env.IS_ELECTRON
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
    onlyTagChange(val){
      // 只在 tag 前后时，禁用空行
      if(val){
        this.options.noEmptyLine = true
      }
    },
    importNotes () {
      const loadingInstance = Loading.service({
        body: true,
        lock: true,
        text: '正在读取笔记'
      })
      readSQLite()
        .then(res => {
          this.bookList = res
          try {
            setTimeout(() => {
              const data = this.bookList[0]
              this.options.book = data.title
              this.updateData(data)
              loadingInstance.close()
            }, 1500)
          } catch (error) {
            loadingInstance.close();
          }
        })
        .catch(e => {
          this.$message.error(e)
          loadingInstance.close();
        })
    },
    selectChange (val) {
      const data = this.bookList.find(i => i.title === val)
      this.updateData(data)
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
      const { title, texts } = data
      this.options.title = title
      this.$emit('list-update', texts)
      if (!texts.length) {
        this.$message.warning('未发现有效内容')
      } else {
        this.parse()
      }
    },
    updateOptions () {
      const { noTag, api, tag, split, tagPosition, reverse, noEmptyLine, onlyTag } = this.options
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
}
</style>
