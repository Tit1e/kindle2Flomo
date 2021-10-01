//index.ts
import { createI18n } from 'vue-i18n'
//引入同级目录下文件
const modules = require.context('./lang', false, /.ts$/)
const modulesFiles: any = {}
modules.keys().forEach(i => {
  modulesFiles[i] = modules(i)
})

function getLangAll(): any {
  let message: any = {}
  getLangFiles(modulesFiles, message)
  return message
}
/**
 * 获取所有语言文件
 * @param {Object} mList
 */
function getLangFiles(mList: any, msg: any) {
  for (let path in mList) {
    if (mList[path].default) {
      //  获取文件名
      let pathName = path.substr(path.lastIndexOf('/') + 1, 5)
      if (msg[pathName]) {
        msg[pathName] = {
          ...mList[pathName],
          ...mList[path].default
        }
      } else {
        msg[pathName] = mList[path].default
      }

    }
  }
}

//注册i8n实例并引入语言文件
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: getLangAll()
})

export default i18n