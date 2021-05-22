<template>
  <div id="app" v-loading="loading" :element-loading-text="loadingText">
    <options
      :list="contentList"
      :tmp-list="tmpList"
      @submit="submit"
      @parse="confirmFirstParse"
      @reverse="reverseList"
      @list-update="listUpdate"
      @update-tag="updateTag"
      @reset="reset"
    />
    <div class="editor radio flex-v">
      <selected-text :selected="checkedMemo.length" :total="contentList.length" />
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
import fly from 'flyio'
import ContentCard from '@/components/ContentCard'
import Options from '@/components/Options'
import SelectedText from '@/components/SelectedText'
export default {
  name: 'app',
  components: {
    ContentCard,
    Options,
    SelectedText
  },
  filters: {},
  data () {
    return {
      contentList: [],
      tmpList: [],
      index: 0,
      loading: false,
      tag: ''
    }
  },
  computed: {
    checkedMemo () {
      return this.contentList.filter(i => i.checked)
    },
    loadingText () {
      return `为减轻服务器压力，导入间隔为 1s。导入进度： ${this.index + 1}/${
        this.checkedMemo.length
      }`
    }
  },
  methods: {
    updateTag (tag) {
      this.tag = tag
    },
    listUpdate (tmpList) {
      this.tmpList = tmpList
    },
    sendMemo (url, list, index) {
      const data = {
        content: list[index].text
      }
      fly
        .post(url, data)
        .then(res => {
          if (index < list.length - 1) {
            setTimeout(() => {
              this.index += 1
              this.sendMemo(url, list, this.index)
            }, 1000)
          } else {
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
    submit (url) {
      this.loading = true
      this.index = 0
      this.sendMemo(url, this.checkedMemo, this.index)
    },
    confirmCanEdit (options) {
      const canEdit = localStorage.getItem('canEdit') || '0'
      if (canEdit === '0') {
        this.$alert('双击 MEMO 可进入编辑模式', '提示', {
          confirmButtonText: '知道了，不再提示',
          callback: action => {
            localStorage.setItem('canEdit', '1')
            this.parse(options)
          }
        })
      }
    },
    confirmFirstParse (options) {
      const hasConfirm = localStorage.getItem('hasConfirm') || '0'
      if (hasConfirm === '0') {
        this.$alert(
          '每次修改“书名”、“Tag”、“Tag 位置”、“分隔符”后需重新解析才会生效，重新解析会还原编辑后的内容。',
          '提示',
          {
            confirmButtonText: '知道了，不再提示',
            callback: action => {
              localStorage.setItem('hasConfirm', '1')
              this.parse(options)
            }
          }
        )
      } else {
        this.parse(options)
      }
    },
    parse (options) {
      const { split, tagPosition } = options
      this.contentList = []
      this.$nextTick(() => {
        this.contentList = JSON.parse(JSON.stringify(this.tmpList)).map(i => {
          let text = ''
          if (split) {
            text = `${i.text}\r\n\r\n${split}`
          } else {
            text = i.text
          }
          if (tagPosition) {
            text = `${this.tag}\r\n\r\n${text}`
          } else {
            text = `${text}\r\n\r\n${this.tag}`
          }
          i.text = text
          return i
        })
        this.confirmCanEdit(options)
      })
    },
    reverseList () {
      this.contentList.reverse()
    },
    reset(){
      this.contentList = []
      this.tmpList = []
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
  .editor {
    overflow: auto;
    padding: 10px;
    margin-left: 10px;
    flex-grow: 1;
    background: rgba(66, 185, 131, 0.2);
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
  .el-select{
    display: block;
  }
  .el-select-dropdown{
    width: 173px!important;
    overflow: hidden;
  }
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
  .el-tag {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
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
