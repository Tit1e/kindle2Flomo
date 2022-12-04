import { toRaw } from 'vue'
import store from '@/store'
const isElectron = store.getters.isElectron
let ipcRenderer = {}
let shell = {}
if(isElectron){
  shell = require('@electron/remote').shell
  ipcRenderer = require('electron').ipcRenderer
}


export function openUrl(url){
  if(!url) return false
  if(isElectron){
    shell.openExternal(url)
  }
}


export function addField(list) {
  return list.map(i => {
    return {
      ...i,
      checked: false,
      content: '',
      content_temp: ''
    }
  })
}

export function delField(proxy) {
  const row = { ...toRaw(proxy) }
  delete row.checked
  delete row.content
  delete row.content_temp
  return row
}