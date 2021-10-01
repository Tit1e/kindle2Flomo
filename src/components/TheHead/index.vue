<template>
  <div class="the-head">
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import i18n from '@/language/index'
import { useI18n } from "vue-i18n"
const { t, locale } = useI18n()
let lang = ref(false)
function changeLang() {
  lang.value = !lang.value
  if(lang.value){
    locale.value = 'zh-CN'
  }else{
    locale.value = 'en-US'
  }
}
</script>

<style lang="scss" scoped>
.the-head{
  height: 40px;
  -webkit-app-region: drag;
}
</style>