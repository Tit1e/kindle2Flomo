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
            drag
            :show-file-list="false"
            :multiple="false"
            action=""
            :auto-upload="false"
            accept=".html"
          >
            <i class="el-icon-folder-add"></i>
            <div class="el-upload__text">
              <em> 选择 HTML 文件</em>
            </div>
          </el-upload>
          <a
            class="how"
            href="https://mp.weixin.qq.com/s/CPIYoGItJVWJGk30MoVNXA"
            target="_blank"
            >如何导出 HTML？</a
          >
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
          <el-form-item label="tag 示例">
            <el-tag size="small">
              {{ tag }}
            </el-tag>
          </el-form-item>
        </template>
        <el-form-item label="分隔符">
          <el-input v-model="options.split" clearable></el-input>
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
        title: '',
        split: '',
        tag: 'kindle',
        api: '',
        noTag: false,
        reverse: false,
        // false 底部，true 顶部
        tagPosition: false
      },
      tag: ''
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
    listenFile () {
      const that = this
      document
        .querySelector('#fileSelect input')
        .addEventListener('change', function () {
          const reader = new FileReader()
          reader.onload = function fileReadCompleted () {
            const { title, texts } = readFile(reader.result)
            that.options.title = title
            that.$emit('list-update', texts)
            if (!texts.length) {
              that.$message.warning('未发现有效内容')
            } else {
              that.parse()
            }
          }
          reader.readAsText(this.files[0])
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
    }
    .el-form-item--mini {
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
