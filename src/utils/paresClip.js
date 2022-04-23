import md5 from 'md5'
import { dexieGet, dexieAdd } from '@/db/dexie'
import init from '@/utils/init.js'

function isObject(obj) {
  var type = typeof obj
  return type === 'function' || (type === 'object' && !!obj)
}

function extend (obj) {
  if (!isObject(obj)) return obj
  var source, prop
  for (var i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i]
    for (prop in source) {
      obj[prop] = source[prop]
    }
  }

  return obj
}

export function getType(position) {
  if (position.indexOf('标注') !== -1 || position.indexOf('Highlight') !== -1) {
    return 1
  }
  if (position.indexOf('笔记') !== -1 || position.indexOf('备注') !== -1) {
    return 2
  }
  if (position.indexOf('书签') !== -1 || position.indexOf('Bookmark') !== -1) {
    return 2
  }
  return 2
}

var helper = {
  split_created: function (text) {
    text = text.split('|').map(i => i.trim())
    try {
      var position = text[0].substr(2)
      var _position = position.replace(/[^0-9]/ig,"")
      var type = getType(position)
      // 笔记的 position 为纯数字
      return {
        type: type,
        position: type === 1 ? position : _position,
        note: '',
      }
    } catch (error) {
      return {
        note: '',
        position: '',
        date: ''
      }
    }
  },
  split_book: function (text) {
    text = text.replace(/（/g, '(').replace(/）/g, ')')
    try {
      var re = /(.+)\((.+)\)/,
        match = re.exec(text)
      if (match) {
        return {
          book: match[1].trim(),
          author: match[2].trim()
        }
      }
      return {
        book: text,
        author: ''
      }
    } catch (error) {
      console.log(error)
    }
  }
}

function Block (texts) {
  this.position = ''
  this.book = ''
  this.author = ''
  this.date = null
  this.content = ''
  this.texts = texts
  this.type = ''

  this.init()
}

Block.prototype.init = function () {
  var para_arr = this.texts
    .replace(/^(\n|\r)*/g, '') // 将开头的换行去除
    .replace(/(\n|\r)*$/g, '') //将结尾的换行去除
    .split('\r\n')
    .filter(i => i && i !== '\n' && i !== '\r') // 除了空字符串，还需将换行符过滤掉
  var data = null

  data = helper.split_book(para_arr[0])
  extend(this, data)

  if (para_arr[1]) {
    data = helper.split_created(para_arr[1])
    extend(this, data)
  }

  this.content = para_arr[2]

  data = null
}


async function paresClip(paragraphs) {
  // 分割笔记
  paragraphs = paragraphs.split('==========').filter(i => i)
  // 将摘录与笔记分离
  const notes = []
  const contents = []
  paragraphs.map(parse_block).forEach(i => {
    if (i) {
      if (i.type === 1 && i.content) {
        contents.push(i)
      }
      if (i.type === 2 && i.content) {
        notes.push(i)
      }
    }
  })
  // 将笔记归到摘录之下
  notes.forEach(i => {
    const index = contents.findIndex(v => v.position.indexOf(i.position) !== -1)
    if (index !== -1) {
      contents[index].note = i.content
    }
  })
  const books = []
  for (let d = 0; d < contents.length; d++) {
    const i = contents[d]
    const title = i.book
    const uuid = md5(`${i.book}${i.content}`)
    const text = i.content
    const note = i.note
    if (!books.includes(title)) {
      books.push(title)
      const uuid = md5(title)
      const bookInfo = {
        uuid,
        title,
        book: title,
        form: 'txt',
      }
      const res = await dexieGet(uuid, 'books')
      if (!res) {
        await dexieAdd(bookInfo, 'books')
      }

    }
    let noteItem = {
      uuid,
      title,
      text,
      note,
      content_update: '',
      uploaded: false,
      form: 'txt'
    }
    const res = await dexieGet(uuid)
    if (!res) {
      await dexieAdd(noteItem)
    }
  }
  await init(books)
  return true
}

function parse_block (texts) {
  texts = texts.trim()

  if (!texts) return null

  return new Block(texts)
}

export default paresClip