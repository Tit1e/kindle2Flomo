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

      return {
        position: text[0].substr(2),
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


function paresClip (paragraphs) {
  paragraphs = paragraphs.split('==========').filter(i => i)

  const blocks = paragraphs.map(parse_block).filter(i => i)
  const result = []
  blocks.forEach(i => {
    const index = result.findIndex(v => v.title === i.book)
    if (index !== -1) {
      result[index].texts.push({
        text: i.content,
        checked: false
      })
    } else {
      result.push({
        title: i.book,
        texts: [
          {
            text: i.content,
            checked: false
          }
        ]
      })
    }
  })
  return result
}

function parse_block (texts) {
  texts = texts.trim()

  if (!texts) return null

  return new Block(texts)
}

export default paresClip