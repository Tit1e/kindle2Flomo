<template>
  <div class="selected-text radio flex">
    <el-tooltip class="item" effect="dark" placement="left">
      <div slot="content" style="width:200px;line-height: 1.5em;">
        未经审视的生活不值得过，未经审视的思想也不应该汇入你的大脑。建议在导入前审视一遍内容。
      </div>
      <div class="checkbox">
        <label class="label" :class="disabled ? 'disabled' : ''">
          <i class="el-icon-success" :class="checkAll ? 'active' : ''"></i>
          <el-checkbox v-model="checkAll" :disabled="disabled"></el-checkbox>
        </label>
      </div>
    </el-tooltip>
    <div class="flex-1">
      已选择 <span class="highlight">{{ selected }}</span> 条 MEMO，共
      <span class="highlight">{{ total }}</span> 条。今天已导入 <span class="highlight">{{importCount}}</span> 条 MEMO
      <a
        class="thanks"
        href="https://mp.weixin.qq.com/s/o793lUsBaWc61fLZzFDlxg"
        target="_blank"
      >
        感谢 LP 的授权
      </a>
    </div>
    <div>
      <el-dropdown>
        <span>
          关于作者
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            ><a href="https://evolly.one" target="_blank"
              >博客</a
            ></el-dropdown-item
          >
          <el-dropdown-item>
            <a href="https://album.animalcrossing.life" target="_blank"
              >Tit1e's Photo Studio</a
            >
          </el-dropdown-item>
          <el-dropdown-item>
            <a
              href="https://personal-1251959693.cos.ap-chengdu.myqcloud.com/2021-05-23-IMG_8849.PNG"
              target="_blank"
            >
              <img
                src="https://personal-1251959693.cos.ap-chengdu.myqcloud.com/2021-05-23-IMG_8849.PNG"
                width="200px"
                alt="即刻"
              />
            </a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectedText',
  props: {
    selected: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    importCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      checkAll: false,
    }
  },
  watch: {
    checkAll (val) {
      this.$emit('change', val)
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.selected-text {
  padding: 10px;
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  margin-bottom: 10px;
  font-weight: bold;
  align-items: center;
  font-size: 15px;
  .highlight {
    color: #55bb8e;
  }
  .thanks {
    color: inherit;
    padding-left: 10px;
  }
  .checkbox {
    padding-right: 10px;
    .label {
      display: block;
      width: 20px;
      height: 20px;
      cursor: pointer;
      .el-icon-success {
        color: #fff;
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 20px;
        font-size: 20px;
        &.active {
          color: #55bb8e;
        }
      }
      .el-checkbox {
        display: none;
      }
    }
  }
}
</style>
