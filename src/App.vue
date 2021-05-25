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
              :key="item.text"
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
</template>

<script>
import fly from 'flyio'
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
      importCount: 0
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
      fly
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
      const { split, tagPosition, notePosition } = options
      this.contentList = []
      this.$nextTick(() => {
        this.contentList = JSON.parse(JSON.stringify(this.tmpList)).map(i => {
          let text = i.note ? [i.text, split, i.note] : [i.text, split]
          if(notePosition) text.reverse()
          if(tagPosition){
            text.unshift(this.tag)
          }else{
            text.push(this.tag)
          }
          i.text = text.filter(i => i).join('\r\n\r\n')
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

    .list-group {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
