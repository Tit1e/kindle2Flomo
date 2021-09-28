<template>
  <div id="app" v-loading="loading" :element-loading-text="loadingText">
    <div v-if="isElectron" id="taskBar">
      Kindle To Flomo
    </div>
    <div class="app-body">
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
        <selected-text
          :selected="checkedMemo.length"
          :total="contentList.length"
          :import-count="importCount"
          :disabled="disabled"
          @change="checkAllChange"
        />
        <div class="flex-1 overauto">
          <draggable
            v-model="contentList"
            class="list-group"
            tag="ul"
            v-bind="dragOptions"
            :disabled="dragDisabled"
            @start="drag = true"
            @end="drag = false"
          >
            <transition-group
              type="transition"
              :name="!drag ? 'flip-list' : null"
            >
              <content-card
                v-for="(item, index) in contentList"
                :key="item.text + index"
                class="list-group-item"
                :input.sync="item.text"
                :check.sync="item.checked"
                :edit.sync="item.isEdit"
                :info="item"
                :disabled="disabled"
              />
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ContentCard from '@/components/ContentCard'
import Options from '@/components/Options'
import SelectedText from '@/components/SelectedText'
import draggable from 'vuedraggable'
export default {
  name: 'app',
  components: {
    ContentCard,
    Options,
    SelectedText,
    draggable
  },
  filters: {},
  data () {
    return {
      date: '',
      contentList: [],
      tmpList: [],
      index: 0,
      loading: false,
      tag: '',
      drag: false,
      dragOptions: {
        animation: 200
      },
      importCount: 0,
      isElectron: !!process.env.IS_ELECTRON
    }
  },
  watch: {
    importCount (val) {
      localStorage.setItem(
        'importCount',
        JSON.stringify({
          [this.date]: val
        })
      )
    }
  },
  computed: {
    dragDisabled () {
      return !!this.contentList.filter(i => i.isEdit).length
    },
    disabled () {
      return this.checkedMemo.length >= 100
    },
    checkedMemo () {
      return this.contentList.filter(i => i.checked)
    },
    loadingText () {
      return `为减轻服务器压力，导入间隔为 1s。导入进度： ${this.index + 1}/${
        this.checkedMemo.length
      }`
    }
  },
  created () {
    this.date = this.setDate()
    this.geImportCount(this.date)
  },
  methods: {
    checkAllChange (val) {
      this.contentList = this.contentList.map((i, idx) => {
        if (val && idx <= 99) {
          i.checked = true
          return i
        }
        i.checked = false
        return i
      })
    },
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
      axios
        .post(url, data)
        .then(res => {
          this.importCount += 1
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
          console.error(e)
          this.loading = false
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
      const { split, tagPosition, notePosition, noEmptyLine, onlyTag, noTag } = options
      this.contentList = []
      this.$nextTick(() => {
        this.contentList = JSON.parse(JSON.stringify(this.tmpList)).map(i => {
          const _text = `${i.text}\r\n`
          // 有笔记并且分隔符有内容时才换行
          const _split = (i.note) ? `${split}${(split || noEmptyLine) ? '\r\n' : ''}` : ''
          let textArr = i.note ? [_text, _split, `${i.note}\r\n`] : [_text, _split]
          // 如果笔记在摘录上方
          if(notePosition) textArr.reverse()
          let text = textArr.filter(i => i).join( noEmptyLine ? '' : '\r\n')
          if(!noTag) {
            // tag 位置在上方
            if(tagPosition){
              // 在上方时空行加在 tag 后
              text = (onlyTag ? `${this.tag}\r\n\r\n` : (noEmptyLine ? `${this.tag}\r\n` : `${this.tag}\r\n\r\n`)) + text
            }else{
              // 在上方时空行加在 tag 前
              text = text + (onlyTag ? `\r\n${this.tag}` : (noEmptyLine ? this.tag : `\r\n${this.tag}`))
            }
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
    reset () {
      this.contentList = []
      this.tmpList = []
    },
    setDate () {
      const D = new Date()
      const y = D.getFullYear()
      const m = D.getMonth() + 1
      const d = D.getDate()
      return `${y}${m}${d}`
    },
    geImportCount (date) {
      let Obj = JSON.parse(localStorage.getItem('importCount') || '{}')
      this.importCount = +Obj[date] || 0
    }
  }
}
</script>

<style lang="scss" scope>
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
  display: flex;
  flex-direction: column;
  height: 100%;
  #taskBar{
    background-color: #b7e6d6;
    height: 20px;
    -webkit-app-region: drag;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
    font-weight: bold;
    user-select:none;
  }
  .app-body{
    -webkit-app-region: no-drag;
    padding: 10px;
    background-color: #b7e6d6;
    height: 0;
    flex-grow: 1;
    box-sizing: border-box;
    color: #2c3e50;
    display: flex;
  }
  .editor {
    overflow: auto;
    padding: 10px;
    margin-left: 10px;
    flex-grow: 1;
    background: rgba(66, 185, 131, 0.2);

    .list-group {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
