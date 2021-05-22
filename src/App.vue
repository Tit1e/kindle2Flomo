<template>
  <div id="app" v-loading="loading" :element-loading-text="loadingText">
    <div class="options radio">
      <div class="top">
        <el-form
          :model="options"
          ref="form"
          :rules="rules"
          label-width="80px"
          size="mini"
          label-suffix="："
          label-position="top"
        >
          <el-form-item label="Api">
            <el-input v-model="options.api" type="password" show-password placeholder="API 采用本地存储"></el-input>
          </el-form-item>
          <el-form-item label-width="0">
            <el-upload
              drag
              :show-file-list="false"
              :multiple="false"
              action=""
              :auto-upload="false"
              accept=".html"
              :on-change="fileChange"
            >
              <i class="el-icon-folder-add"></i>
              <div class="el-upload__text">
                将 HTML 拖至此处，或<em> 选择文件</em>
              </div>
            </el-upload>
            <a class="how" href="https://mp.weixin.qq.com/s/CPIYoGItJVWJGk30MoVNXA" target="_blank">如何导出 HTML？</a>
          </el-form-item>
          <el-form-item label="书名">
            <el-input v-model="options.title"></el-input>
          </el-form-item>
          <el-form-item label="Tag">
            <div class="flex">
              <div class="flex-1">
                <el-input
                  v-model="options.tag"
                  :disabled="options.noTag"
                ></el-input>
              </div>
              <div class="flex-1 pl-10">
                <el-checkbox v-model="options.noTag" label=""
                  >隐藏 tag</el-checkbox
                >
              </div>
            </div>
          </el-form-item>
          <template v-if="!options.noTag">
            <el-form-item label="Tag 位置">
              <el-switch
                v-model="options.tagPosition"
                active-text="顶部"
                inactive-text="底部">
              </el-switch>
            </el-form-item>
            <el-form-item label="tag 示例">
              <el-tag size="small">
                {{ tag }}
              </el-tag>
            </el-form-item>
          </template>
          <el-form-item label="分隔符">
            <el-input v-model="options.split"></el-input>
          </el-form-item>
          <el-form-item label="列表顺序">
            <el-switch
              v-model="options.reverse"
              active-text="倒序"
              inactive-text="顺序"
              @change="reverseList">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom">
        <el-button
          type="primary"
          size="mini"
          :disabled="!tmpList.length"
          @click="confirmFirstParse"
          >解析</el-button
        >
        <el-button
          type="primary"
          :disabled="disabledSend"
          size="mini"
          @click="send"
          >导入 Flomo</el-button
        >
      </div>
    </div>
    <div class="editor radio flex-v">
      <div class="selected-text radio">
        共 {{ contentList.length }} 条 MEMO，已选择 {{ checkedMemo.length }} 条
        MEMO（每天通过 API 最多发布 100 条 MEMO）
        <el-tooltip class="item" effect="dark" placement="bottom">
          <div slot="content" style="width:200px;">
            tip：未经审视的生活不值得过，未经审视的思想也不应该汇入你的大脑。所以在导入前审视一遍内容，手动选择需要导入的内容。
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
        <a class="thanks" href="https://mp.weixin.qq.com/s/o793lUsBaWc61fLZzFDlxg" target="_blank">
          感谢 LP 的授权
        </a>
      </div>
      <div>
        <content-card
          :input.sync="item.text"
          :check.sync="item.checked"
          v-for="(item, index) in contentList"
          :info="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import contentCard from './components/contentCard'
import readFile from './utils/readFile.js'
import fly from 'flyio'
export default {
  name: 'app',
  components: {
    contentCard
  },
  filters: {},
  data () {
    return {
      contentList: [],
      rules: {},
      options: {
        title: '',
        split: '',
        tag: 'kindle',
        api:'',
        noTag: false,
        reverse: false,
        // false 底部，true 顶部
        tagPosition: false
      },
      tmpList: [],
      index: 0,
      loading: false
    }
  },
  computed: {
    tag () {
      if (this.options.noTag) return ''
      const { tag, title } = this.options
      if (!tag) {
        return `#${title}`
      } else {
        return `#${tag}/${title}`
      }
    },
    checkedMemo () {
      return this.contentList.filter(i => i.checked)
    },
    disabledSend () {
      return !this.checkedMemo.length || !this.options.api
    },
    loadingText(){
      return `为减轻服务器压力，导入间隔为 1s。导入进度： ${this.index + 1}/${this.checkedMemo.length}`
    }
  },
  created () {
    this.setOptions()
  },
  methods: {
    sendMemo(list, index){
      const data = {
        content: list[index].text
      }
      fly
        .post(this.options.api, data)
        .then(res => {
          if(index < list.length - 1){
            setTimeout(() => {
              this.index += 1
              this.sendMemo(list,this.index)
            }, 1000)
          }else{
            this.$message.success('导入完毕')
            this.loading = false
          }
        })
        .catch(e => {
          this.loading = false
          console.error(e)
          this.$message.error('记录失败')
        })
    },
    send () {
      this.loading = true
      this.index = 0
      this.sendMemo(this.checkedMemo, this.index)
    },
    confirmCanEdit(){
      const canEdit = localStorage.getItem('canEdit') || '0'
      if (canEdit === '0') {
        this.$alert(
          '双击 MEMO 可进入编辑模式',
          '提示',
          {
            confirmButtonText: '知道了，不再提示',
            callback: action => {
              localStorage.setItem('canEdit', '1')
              this.parse()
            }
          }
        )
      }
    },
    confirmFirstParse () {
      const hasConfirm = localStorage.getItem('hasConfirm') || '0'
      if (hasConfirm === '0') {
        this.$alert(
          '每次修改“书名”、“Tag”、“Tag 位置”、“分隔符”后需重新解析才会生效，重新解析会还原编辑后的内容。',
          '提示',
          {
            confirmButtonText: '知道了，不再提示',
            callback: action => {
              localStorage.setItem('hasConfirm', '1')
              this.parse()
            }
          }
        )
      } else {
        this.parse()
      }
    },
    parse () {
      this.contentList = []
      this.$nextTick(() => {
        this.updateOptions()
        this.contentList = JSON.parse(JSON.stringify(this.tmpList)).map(i => {
          let text = ''
          if (this.options.split) {
            text = `${i.text}\r\n\r\n${this.options.split}`
          } else {
            text = i.text
          }
          if(this.options.tagPosition){
            text = `${this.tag}\r\n\r\n${text}`
          }else{
            text = `${text}\r\n\r\n${this.tag}`
          }
          i.text = text
          return i
        })
        this.confirmCanEdit()
      })
    },
    reset(){
      this.contentList = []
      this.tmpList  = []
    },
    fileChange (file) {
      this.reset()
      const path = file.raw.path
      const { title, texts } = readFile(path)
      this.options.title = title
      this.tmpList = texts
      if (!texts.length) {
        this.$message.warning('未发现有效内容')
      }else{
        this.parse()
      }
    },
    setOptions () {
      const options = JSON.parse(localStorage.getItem('options'))
      this.$set(this, 'options', {
        ...this.options,
        ...options
      })
    },
    updateOptions () {
      const { noTag, api, tag, split, tagPosition, reverse } = this.options
      const options = {
        noTag,
        api,
        tag,
        split,
        tagPosition,
        reverse
      }
      localStorage.setItem('options', JSON.stringify(options))
    },
    reverseList(){
      this.contentList.reverse()
    }
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: 'DIN-Regular';
  src: url('./assets/fonts/DINPro-Regular.otf') format('opentype');
}
@font-face {
  font-family: 'DIN-Regular';
  src: url('./assets/fonts/DINPro-Bold.otf') format('opentype');
  font-weight: bold;
}
#app {
  padding: 10px;
  background-color: #b7e6d6;
  height: 100%;
  box-sizing: border-box;
  color: #2c3e50;
  display: flex;
  .options {
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
      .how{
        color: inherit;
        font-size: 12px;
      }
      .el-form-item--mini{
        margin-bottom: 10px;
      }
      .el-upload-dragger {
        .el-icon-folder-add {
          font-size: 67px;
          color: #c0c4cc;
          margin: 40px 0 16px;
          line-height: 50px;
        }
      }
    }
    .bottom {
      text-align: center;
      padding-top: 10px;
      box-shadow: 0 -10px 10px -16px rgba($color: #000000, $alpha: 0.4);
    }
    .el-upload {
      width: 100%;
    }
    .el-tag {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .el-upload-dragger {
      width: 100%;
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
  .editor {
    overflow: auto;
    padding: 10px;
    margin-left: 10px;
    flex-grow: 1;
    background: rgba(66, 185, 131, 0.2);
    .selected-text {
      padding: 10px;
      background-color: rgba($color: #ffffff, $alpha: 0.5);
      margin-bottom: 10px;
      font-weight: bold;
    .thanks{
      color: inherit;
      padding-left: 10px;
    }
    }
  }
}
</style>
<style lang="scss">
* {
  font-family: 'DIN-Regular', 'PingFang SC', Helvetica, Arial, sans-serif !important;
  outline: none;
}
html,
body {
  height: 100%;
  margin: 0;
  ::-webkit-scrollbar {
    display: none;
  }
  .text-right {
    text-align: right;
  }
  .radio {
    border-radius: 6px;
  }
  .flex {
    display: flex;
  }
  .flex-v {
    display: flex;
    flex-direction: column;
  }
  .flex-1 {
    flex-grow: 1;
  }
  .pd-10 {
    padding: 10px;
  }
  .pt-10 {
    padding-top: 10px;
  }
  .pl-10 {
    padding-left: 10px;
  }
  .pr-10 {
    padding-right: 10px;
  }
  .pb-10 {
    padding-bottom: 10px;
  }
}
</style>
