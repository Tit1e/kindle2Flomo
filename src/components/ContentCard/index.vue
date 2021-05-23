<template>
  <li class="content-card">
    <div class="checkbox">
      <label class="label" :class="disabled ? 'disabled' : ''">
        <i class="el-icon-success" :class="checked ? 'active' : ''"></i>
        <el-checkbox v-model="checked" :disabled="disabled"></el-checkbox>
      </label>
    </div>
    <div class="priview radio" @dblclick="isEdit = true">
      <template v-if="isEdit">
        <el-input v-model="content" type="textarea" autosize :rows="5"></el-input>
        <div class="pt-10 text-right">
          <el-button type="primary" size="mini" @click="isEdit = false">完成</el-button>
        </div>
      </template>
      <pre v-else>{{content}}</pre>
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
    data(){
      return {
        content: this.info.text,
        checked: this.info.checked,
        isEdit: false,
      }
    },
    watch: {
      info: {
        handler({checked, text}){
          this.content = text
          this.checked = checked
        },
        deep: true
      },
      checked(value){
        this.$emit('update:check', value)
      },
      content(value){
        this.$emit('update:input', value)
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
.content-card{
  cursor: move;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  .checkbox{
    padding-right: 10px;
    .label{
      display: block;
      width: 30px;
      height: 30px;
      cursor: pointer;
      .el-icon-success{
        color: #fff;
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 30px;
        font-size: 30px;
        &.active{
          color: #55BB8E;
        }
      }
      .el-checkbox{
        display: none;
      }
    }
  }
  .input{
    flex: 1;
    margin-left: 20px;
  }
  .priview{
    background-color: #fff;
    padding: 10px;
    width: 100%;
    font-size: 14px;
    pre{
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
      line-height: 1.8;
    }
  }
}
</style>