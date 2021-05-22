<template>
  <div class="selected-text radio">
    共 {{ total }} 条 MEMO，已选择 {{ selected }} 条
    MEMO（每天通过 API 最多发布 100 条 MEMO）
    <el-tooltip class="item" effect="dark" placement="bottom">
      <div slot="content" style="width:200px;">
        tip：未经审视的生活不值得过，未经审视的思想也不应该汇入你的大脑。所以在导入前审视一遍内容，手动选择需要导入的内容。
      </div>
      <i class="el-icon-info"></i>
    </el-tooltip>
    <a
      class="thanks"
      href="https://mp.weixin.qq.com/s/o793lUsBaWc61fLZzFDlxg"
      target="_blank"
    >
      感谢 LP 的授权
    </a>
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
    }
  }
}
</script>

<style lang="scss" scoped>
.selected-text {
  padding: 10px;
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  margin-bottom: 10px;
  font-weight: bold;
  .thanks {
    color: inherit;
    padding-left: 10px;
  }
}
</style>
