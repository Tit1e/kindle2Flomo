<template>
  <div class="selected-text radio flex">
    <div>
      已选择 <span class="highlight">{{ selected }}</span> 条 MEMO，共 <span class="highlight">{{ total }}</span> 条（每天通过 API 最多发布 100 条 MEMO）
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
    <div>
      <el-dropdown>
        <span>
          关于作者
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><a href="https://evolly.one" target="_blank">博客</a></el-dropdown-item>
          <el-dropdown-item>
            <a href="https://album.animalcrossing.life" target="_blank">Tit1e's Photo Studio</a>
          </el-dropdown-item>
          <el-dropdown-item>
            <a href="https://personal-1251959693.cos.ap-chengdu.myqcloud.com/2021-05-23-IMG_8849.PNG" target="_blank">
              <img src="https://personal-1251959693.cos.ap-chengdu.myqcloud.com/2021-05-23-IMG_8849.PNG" width="200px" alt="即刻">
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
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  .highlight {
    color: #55BB8E;
  }
  .thanks {
    color: inherit;
    padding-left: 10px;
  }
}
</style>
