<template>
  <div class="right-content" :class="{electron: isElectron}">
    <right-content-bar
      :class="{'right-content-position': isElectron}"
      @export="handleExport"
    />
    <div class="content-box">
      <div v-if="!contentList.length" class="no-data"></div>
      <div class="memo-box">
        <memo-card
          @dblclick="showDialog(item)"
          @click="toggleChecked(item)"
          @reset="resetMemo(item)"
          v-for="(item, index) in contentList"
          :key="item.uuid"
          class="memo-item"
          :info="item"
          :index="index"
        />
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      center
      width="600px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-input v-model="activeItem.content_temp" type="textarea" :autosize="{ minRows: 16, maxRows: 36 }" placeholder="" clearable></el-input>
      <template #footer>
          <el-button @click="closeDialog" size="mini" type="default">{{ t('cancel') }}</el-button>
          <el-button @click="save" size="mini" type="primary">{{ t('save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import RightContentBar from '@/components/RightContentBar'
import MemoCard from '@/components/MemoCard'
import { nextTick, watch, ref, computed, onMounted } from 'vue'
import JSonToCSV from '@/utils/exportCSV'
import { useStore } from 'vuex'
import { dexiePut } from '@/db/dexie'
import { delField } from '@/utils/utils'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
const { t } = useI18n()

const store = useStore()
const isElectron = store.getters.isElectron

const $emit = defineEmits([
  'export',
])

function handleExport(command: string){
  if(!contentList.value.length) return false
  switch(command){
    case 'markdown':
      exportMD()
      break
    case 'csv':
      exportCSV()
      break
  }
}

function toggleChecked(item: any) {
  if(item.uploaded) return
  item.checked = !item.checked
  store.commit('UPDATE_TEXT_LIST', { uuid: item.uuid, checked: item.checked })
}

async function save(){
  const { content_temp, uuid, content } = activeItem.value
  if(content_temp !== content){
    activeItem.value.content = content_temp
    activeItem.value.content_update = content_temp
    store.commit('UPDATE_TEXT_LIST', {uuid, content_update: content_temp})
    await dexiePut(delField(activeItem.value))
  }
  closeDialog()
}

async function resetMemo(item: any) {
  item.uploaded = false
  item.content_update = ''
  store.commit('UPDATE_TEXT_LIST', { uuid: item.uuid, content_update: '', uploaded: false })
  await dexiePut(delField(item))
}

const contentList = computed(() => store.getters.textList)
const parseOptions = computed(() => store.getters.parseOptions)

function exportCSV () {
  const {options, tag} = parseOptions.value
  const { title } = options
  const data = contentList.value.map(i => {
    return {
      title,
      text: i.text.replace(/\r/g, '').replace(/\n/g, ''),
      content_update: i.content_update.replace(/\r/g, '').replace(/\n/g, ''),
      note: i.note || '',
      tag: tag || '',
      form: i.form || ''
    }
  })

  JSonToCSV.setDataConver({
    data,
    fileName: title,
    columns: {
      title: ['书名', '书摘', '笔记', '标签', '修改内容'],
      key: ['title', 'text', 'note', 'tag', 'content_update']
    }
  })
}

function exportMD(){
  const { options, tag } = parseOptions.value
  const { title } = options
  const content = contentList.value.reduce((pre:string, val:any) => {
    const content = (val.update_content || val.content)
    return pre + `- ${content.replace(val.note, '').replace(tag, '').replace(/\r/g, '').replace(/\n/g, '')}\n\n`
  }, `# ${title}\n\n`)

  const blob = new Blob([ content ], { type: 'text/markdown' })
  const objectURL = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = objectURL
  a.download = `${title}.md`
  a.click()

  URL.revokeObjectURL(objectURL)
}

const dialogVisible = ref(false)
const activeItem = ref({})
function showDialog (item){
  if(item.uploaded) return
  activeItem.value = item
  dialogVisible.value = true
}


function closeDialog(){
  activeItem.value = {}
  dialogVisible.value = false
}


</script>

<style lang="scss" scoped>
.right-content {
  position: relative;
  display: flex;
  flex-direction: column;
  &.electron{
    margin-top: -40px;
    padding-top: 40px;
  }
  &-position {
    position: absolute;
    margin-top: -40px;
  }
  .content-box{
    flex: 1;
    padding: 10px 10px 0px;
    overflow: auto;
    .no-data{
      background-image: url(~@/assets/img/no-data.png);
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 128px auto;
    }
    .memo-box{
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      .memo-item{
        width: calc((100% - 20px) / 3);
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-child(3n) {
          margin-right: 0px;
        }
      }
    }
  }
  :deep(.el-dialog) {
    border-radius: 6px;
    .el-dialog__header{
      display: none;
    }
    .el-dialog__body{
      padding: 20px 10px 0px;
      .el-textarea{
        .el-textarea__inner{
          border: none;
          text-align: justify;
        }
      }
    }
  }
}
</style>
