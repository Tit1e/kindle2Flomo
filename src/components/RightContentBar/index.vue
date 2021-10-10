<template>
  <div class="right-content-bar">
    <div class="flex-1 flex">
      <el-button type="text" class="mr-10" @click="selectedAll(true)">{{t('all')}}</el-button>
      已选择 <span class="highlight">{{ selectedNum }}</span> 条 MEMO，共
      <span class="highlight">{{ total }}</span> 条。今日已导入
      <span class="highlight">{{ importCount }} / 100</span> 条 MEMO
    </div>
    <div class="bar-right">
      <div class="thanks" v-if="isElectron" @click="openUrl('https://mp.weixin.qq.com/s/o793lUsBaWc61fLZzFDlxg')">
        {{t('thanks')}}
      </div>
      <a class="thanks" v-else href="https://mp.weixin.qq.com/s/o793lUsBaWc61fLZzFDlxg" target="_blank">{{t('thanks')}}</a>
      <el-tooltip
          effect="dark"
          placement="bottom"
        >
          <template #content>
            <div class="help-box">
              <div class="mb-10">注意事项：</div>
              <div class="mb-6">1. 导入前必须填写 Api 与选择要导入的 MEMO</div>
              <div class="mb-6">2. 双击 MEMO 可进入编辑状态</div>
              <div class="mb-6">3. 修改配置项会触发解析</div>
              <div class="mb-6">4. 每次解析重置 MEMO 的内容，因此先设置好配置项再进行编辑</div>
              <div class="mb-6" v-if="isElectron">5. 在使用微信读书导入过程中请勿手动刷新页面，会导致获取不到笔记，如果刷新了，请退出应用后重新打开。</div>
              <div class="mb-10">还有其他问题？扫码进群反馈</div>
              <img
                class="block block-center"
                width="200"
                height="200"
                src="https://gblobscdn.gitbook.com/assets%2F-MVEe4qiW5TBO3wosktr%2F-McqOyO9scmhvjxOKjqy%2F-McqT6ENIJnzZEGJhoeX%2F%E5%9B%BE%E7%89%87.png?alt=media&token=a1a523d4-f926-4615-b1de-b6fced4c46ab"
              />
            </div>
          </template>
          <div class="help k-icon" :title="t('help')" @click=""></div>
        </el-tooltip>
      <div class="translate k-icon" title="中/英文切换" @click="toggleLanguage"></div>
      <el-dropdown @command="handleCommand">
        <div class="setting k-icon"></div>
        <template #dropdown>
          <el-dropdown-menu>
            <template v-if="isElectron">
              <el-dropdown-item command="update">{{t('check-update')}}</el-dropdown-item>
              <el-dropdown-item command="blog">
                {{t('blog')}}
              </el-dropdown-item>
              <el-dropdown-item command="photo">
                Tit1e's Photo Studio
              </el-dropdown-item>
              <el-dropdown-item command="jike">
                {{t('jike')}}
              </el-dropdown-item>
            </template>
            <template v-else>
              <el-dropdown-item
                ><a href="https://evolly.one" target="_blank"
                  >{{t('blog')}}</a
                ></el-dropdown-item
              >
              <el-dropdown-item>
                <a href="https://album.animalcrossing.life" target="_blank"
                  >Tit1e's Photo Studio</a
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <a
                  href="https://web.okjike.com/u/FFDB1E46-63DC-43BE-AA1A-36F3D9CD0017"
                  target="_blank"
                >
                  {{t('jike')}}
                </a>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, nextTick, onMounted, computed } from 'vue'
import { ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {useStore} from 'vuex'
const store = useStore()
const isElectron = store.getters.isElectron
let ipcRenderer = {}
let shell = {}
if(isElectron){
  shell = require('@electron/remote').shell
  ipcRenderer = require('electron').ipcRenderer

}


function selectedAll(status = true){
  store.commit('SELECT_ALL', status)
}


const { t, locale } = useI18n()
function toggleLanguage () {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  window.localStorage.setItem('locale', locale.value)
}

store.commit('GET_IMPORT_COUNT')
const selectedNum = computed(() =>store.getters.selectedList.length)
const total = computed(() =>store.getters.textList.length)
const importCount = computed(() =>store.getters.importCount)

function openUrl(url: string = ''){
  if(!url) return false
  if(isElectron){
    shell.openExternal(url)
  }
}
const urlMap = {
  blog: 'https://evolly.one/',
  photo: 'https://album.animalcrossing.life/',
  jike: 'https://web.okjike.com/u/FFDB1E46-63DC-43BE-AA1A-36F3D9CD0017',
}
function handleCommand(type: string){
  if(isElectron){
    if(type === 'update'){
      ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log(arg) // prints "pong"
      })
      ipcRenderer.send('update')
    }else{
      openUrl(urlMap[type])
    }
  }
}

let loadingInstance: any = null

if(isElectron){
  ipcRenderer.on('updateDownloading', async(event, info) => {
    if(info === 'updateDownloaded'){
      loadingInstance.close()
      await nextTick()
      loadingInstance = null
    }else{
      if(!loadingInstance){
        loadingInstance = ElLoading.service({
          text: '正在下载... 0%',
          lock: true,
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 1)'
        })
      }
      const percent = info.percent.toFixed(2)
      loadingInstance.setText(`正在下载... ${percent}%`)
    }
  })

  ipcRenderer.on('updateDownloaded', () => {
  })
  ipcRenderer.on('updateNotAvailable', (event, info) => {
    console.log('updateNotAvailable', info)
  })
}

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
  cursor: pointer;
  .bar-right{
    flex-shrink: 0;
    display: flex;
    align-items: center;
    .thanks{
      margin-right: 16px;
      text-decoration: underline;
    }
  }
  .k-icon{
    width: 22px;
    height: 22px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    &:hover {
      cursor: pointer;
    }
    &.help {
      margin-right: 16px;
      background-image: url(~@/assets/icons/help.png);
    }
    &.translate {
      margin-right: 16px;
      background-image: url(~@/assets/icons/translate.png);
    }
    &.setting {
      background-image: url(~@/assets/icons/setting.png);
    }
  }
}
.help-box{
  width: 300px;
  line-height: 1.5rem;
}
</style>
