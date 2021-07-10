function isObject (obj) {
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
  if (position.indexOf('标注') !== -1) {
    return 1
  }
  if (position.indexOf('笔记') !== -1 || position.indexOf('备注') !== -1) {
    return 2
  }
  if (position.indexOf('书签') !== -1) {
    return 2
  }
}

var helper = {
  split_created: function (text) {
    text = text.split('|').map(i => i.trim())
    try {
      var re = /添加于\s+(\d{4})年(\d+)月(\d+)日.*(上|下)午(\d+):(\d+):(\d+)$/,
        match = re.exec(text[1])
      var m7 = +match[5]

      var hours = match[4] === '上' ? m7 : m7 + 12 === 24 ? 0 : m7 + 12,
        minutes = match[6],
        seconds = match[7]
      var position = text[0].substr(2)
      var _position = position.replace(/[^0-9]/ig,"")
      var type = getType(position)
      // 笔记的 position 为纯数字
      return {
        type: type,
        position: type === 1 ? position : _position,
        note: '',
        date: new Date(
          match[1] +
            ' ' +
            match[2] +
            ' ' +
            match[3] +
            ' ' +
            hours +
            ':' +
            minutes +
            ':' +
            seconds
        )
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
      return {
        book: match[1].trim(),
        author: match[2].trim()
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
  var para_arr = this.texts.split('\r\n').filter(i => i)

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


function paresClip(paragraphs) {
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
  const result = []
  contents.forEach(i => {
    const index = result.findIndex(v => v.title === i.book)
    if (index !== -1) {
      result[index].texts.push({
        text: i.content,
        note: i.note,
        checked: false,
        isEdit: false
      })
    } else {
      result.push({
        title: i.book,
        texts: [
          {
            text: i.content,
            note: i.note,
            checked: false,
            isEdit: false
          }
        ]
      })
    }
  })
  return result.reverse()
}

function parse_block (texts) {
  texts = texts.trim()

  if (!texts) return null

  return new Block(texts)
}

export default paresClip