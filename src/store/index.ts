import { createStore } from 'vuex'
interface Options {
  noTag: any,
  tagPosition: any,
  noEmptyLine: any,
  split: any,
  notePosition: any
}

interface Text {
  content_update: string
  uuid: string,
  title: string,
  content_temp: string
  content: string
  text: string
  note: string
  checked: boolean
  uploaded: boolean
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
    // 最终展示的文本
    const _content = handleTag(options, tag, text)
    i.content = i.content_update || _content
    i.content_temp = i.content_update || _content
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
      // 今日已导入数量
      importCount: 0,
      // 渲染的笔记数据
      textList: [],
      // 当前图书的笔记源数据
      tempList: [],
      // 解析出来的图书及笔记列表
      bookList: [],
      parseOptions: null
    }
  },
  mutations: {
    UPDATE_BOOK(state:any, data) {
      const book = state.bookList.find((i:any) => i.title === data.title)
      book.book = data.book
    },
    SORT_BOOK_LIST(state:any, data) {
      if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          const index = state.bookList.findIndex((i: any) => i.title === item)
          state.bookList.unshift(state.bookList.splice(index, 1)[0])
        }
      } else {
        const index = state.bookList.findIndex((i: any) => i.title === data)
        state.bookList.unshift(state.bookList.splice(index, 1)[0])
      }
    },
    SET_BOOK_LIST(state: any, data) {
      state.bookList = data
      const titleList = data.map((i:any) => i.title)
      localStorage.setItem('bookSort', JSON.stringify(titleList))
    },
    UPDATE_PARSE_OPTIONS(state: any, payload) {
      state.parseOptions = payload
    },
    UPDATE_TEXT_LIST(state: any, payload) {
      const { parseOptions, bookList } = state
      if (!bookList.length || !parseOptions) return []
      const { options } = parseOptions
      const tempList: any = bookList.find((i: any) => i.title === options.title)
      if (tempList && tempList.texts) {
        const index = tempList.texts.findIndex((i: any) => i.uuid === payload.uuid)
        if (index >= 0) tempList.texts[index] = { ...tempList.texts[index], ...payload }
      }
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
    SELECT_ALL({ parseOptions, bookList }, status) {
      const book = bookList.find((i:any) => i.title === parseOptions.options.title)
      book.texts.forEach((i:any) => {
        i.checked = status
      })
    },
    GET_IMPORT_COUNT(state) {
      let Obj = JSON.parse(localStorage.getItem('importCount') || '{}')
      state.importCount = +Obj[date] || 0
    },
  },
  getters: {
    textList: state => {
      const { parseOptions, bookList = [] } = state
      if (!bookList.length || !parseOptions) return []
      const {options, tag} = parseOptions
      const tempList: any = bookList.find((i: any) => i.title === options.title)
      return tempList ? parse(options, tempList.texts, tag) : []
    },
    bookList: state => state.bookList,
    selectedList: (state, getters) => getters.textList.filter((i: Text) => i.checked),
    importDisabled: (state, getters) => getters.selectedList.length >= 100,
    importCount: state => state.importCount,
    isElectron: () => !!process.env.IS_ELECTRON,
    parseOptions: state => state.parseOptions,
  }
})

export default store