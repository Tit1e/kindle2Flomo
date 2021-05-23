<template>
  <li class="content-card">
    <div class="checkbox">
      <label class="label" :class="disabled ? 'disabled' : ''">
        <i class="el-icon-success" :class="checked ? 'active' : ''"></i>
        <el-checkbox v-model="checked" :disabled="disabled"></el-checkbox>
      </label>
    </div>
    <div class="priview radio" @dblclick="handleEdit">
      <template v-if="isEdit">
        <el-input
          v-model="content"
          type="textarea"
          autosize
          :rows="5"
        ></el-input>
        <div class="pt-10 text-right">
          <el-button type="primary" size="mini" @click="submit">完成</el-button>
        </div>
      </template>
      <pre v-else>{{ content }}</pre>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ContentCard',
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      content: this.info.text,
      checked: this.info.checked,
      isEdit: this.info.isEdit
    }
  },
  watch: {
    info: {
      handler ({ checked, text, isEdit }) {
        this.content = text
        this.checked = checked
        this.isEdit = isEdit
      },
      deep: true
    },
    isEdit (value) {
      this.$emit('update:edit', value)
    },
    checked (value) {
      this.$emit('update:check', value)
    }
  },
  methods: {
    handleEdit () {
      const canDrag = localStorage.getItem('canDrag') || '0'
      if (canDrag === '0') {
        this.$alert('有 MEMO 在编辑模式时，列表无法进行拖动排序。', '提示', {
          confirmButtonText: '知道了，不再提示',
          callback: action => {
            localStorage.setItem('canDrag', '1')
            this.$emit('update:edit', true)
          }
        })
      }else{
        this.$emit('update:edit', true)
      }
    },
    submit () {
      this.$emit('update:edit', false)
      this.$emit('update:input', this.content)
    }
  }
}
</script>

<style lang="scss" scoped>
.content-card {
  cursor: move;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  .checkbox {
    padding-right: 10px;
    .label {
      display: block;
      width: 30px;
      height: 30px;
      cursor: pointer;
      .el-icon-success {
        color: #fff;
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 30px;
        font-size: 30px;
        &.active {
          color: #55bb8e;
        }
      }
      .el-checkbox {
        display: none;
      }
    }
  }
  .input {
    flex: 1;
    margin-left: 20px;
  }
  .priview {
    background-color: #fff;
    padding: 10px;
    width: 100%;
    font-size: 14px;
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
      line-height: 1.8;
    }
  }
}
</style>
