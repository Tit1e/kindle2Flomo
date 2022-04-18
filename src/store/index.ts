import { createStore } from 'vuex'
interface Options {
  noTag: any,
  tagPosition: any,
  noEmptyLine: any,
  split: any,
  notePosition: any
}

interface Text {
  text: string
  note: string
  checked: boolean
  isEdit: boolean,
  _text?: string,
  _tag?: string,
  send?: boolean
}

function handleTag(options: Options, tag: string, text: string){
  const {noTag, tagPosition, noEmptyLine} = options
  let _text = text
  if(!noTag) {
    // tag 位置在上方
    if(tagPosition){
      // 在上方时空行加在 tag 后
      _text = (noEmptyLine ? `${tag}\r\n` : `${tag}\r\n\r\n`) + _text
    }else{
      // 在上方时空行加在 tag 前
      _text = _text + (noEmptyLine ? tag : `\r\n${tag}`)
    }
  }
  return _text
}

function parse (options: Options, contentList: Text[], tag: string) {
  const {
    split,
    tagPosition,
    notePosition,
    noEmptyLine,
    noTag
  } = options
  // 渲染用的tag
  const result = JSON.parse(JSON.stringify(contentList)).map((i:Text) => {
    const _text = `${i.text}\r\n`
    // 有笔记并且分隔符有内容时才换行
    const _split = i.note ? `${split}${split || noEmptyLine ? '\r\n' : ''}` : ''
    let textArr = i.note ? [_text, _split, `${i.note}\r\n`] : [_text, _split]
    // 如果笔记在摘录上方
    if (notePosition) textArr.reverse()
    let text = textArr.filter(i => i).join(noEmptyLine ? '' : '\r\n')
    i._text = i.text
    i._tag = tag
    i.text = handleTag(options, tag, text)
    i.send = false
    return i
  })
  return result
}

function setDate () {
  const D = new Date()
  const y = D.getFullYear()
  const m = D.getMonth() + 1
  const d = D.getDate()
  return `${y}${m}${d}`
}
const date = setDate()

const store = createStore({
  state () {
    return {
      activeBook: {},
      textList: [],
      tempList: [],
      importCount: 0
    }
  },
  mutations: {
    SET_TEXT_LIST(state: any, {options, tag}) {
      state.textList = parse(options, state.tempList, tag)
    },
    SET_TEMP_LIST(state: any, list) {
      state.tempList = list
    },
    GET_IMPORT_COUNT(state) {
      let Obj = JSON.parse(localStorage.getItem('importCount') || '{}')
      state.importCount = +Obj[date] || 0
    },
    SET_IMPORT_COUNT(state, count) {
      state.importCount = count
      localStorage.setItem(
        'importCount',
        JSON.stringify({
          [date]: count
        })
      )
    },
    SET_SUCCESS(state, _item) {
      const item = state.textList.find((i: Text) => i.text === _item.text)
      item.checked = false
      item.send = true
    },
    SELECT_ALL(state, status) {
      state.textList = state.textList.map((i: Text) => {
        i.checked = status
        return i
      })
    }
  },
  getters: {
    textList: state => state.textList,
    selectedList: state => state.textList.filter((i: Text) => i.checked),
    importDisabled: (state, getters) => getters.selectedList.length >= 100,
    importCount: state => state.importCount,
    isElectron: () => !!process.env.IS_ELECTRON
  }
})

export default store