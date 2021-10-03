<template>
  <div class="right-content-bar">
    <div class="flex-1 flex">
      test
      已选择 <span class="highlight">{{ selected }}</span> 条 MEMO，共
      <span class="highlight">{{ total }}</span> 条。今天已导入
      <span class="highlight">{{ importCount }} / 100</span> 条 MEMO
      <a
        class="thanks"
        href="https://mp.weixin.qq.com/s/o793lUsBaWc61fLZzFDlxg"
        target="_blank"
      >
        感谢 LP 的授权
      </a>
      <div class="pl-10 pointer">
        <el-tooltip
          effect="dark"
          content="发送邮件至：evollyone@outlook.com"
          placement="bottom"
        >
          <img
            slot="content"
            width="200px"
            height="200px"
            src="https://gblobscdn.gitbook.com/assets%2F-MVEe4qiW5TBO3wosktr%2F-McqOyO9scmhvjxOKjqy%2F-McqT6ENIJnzZEGJhoeX%2F%E5%9B%BE%E7%89%87.png?alt=media&token=a1a523d4-f926-4615-b1de-b6fced4c46ab"
            alt=""
            srcset=""
          />
          <span style="color:#d96767;">
            有问题？
          </span>
        </el-tooltip>
      </div>
    </div>
    <div class="translate" @click="toggleLanguage"></div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
function toggleLanguage () {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  window.localStorage.setItem('locale', locale.value)
}

const props = defineProps({
  selected: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  importCount: {
    type: Number,
    default: 0
  }
})

const {importCount, selected, total} = toRefs(props)
</script>

<style lang="scss" scoped>
.right-content-bar {
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  background-color: transparent;
  user-select: none;
  line-height: 40px;
  padding: 0 10px;
  font-weight: bold;
  font-size: 15px;
  display: flex;
  align-items: center;
  .translate {
    width: 20px;
    height: 20px;
    background-image: url(~@/assets/icons/translate.png);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-sizing: border-box;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
