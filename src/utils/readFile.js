const cheerio = require('cheerio')
import { getType } from './paresClip'
function readFile(sourceText) {
  // 除字符串内所有的换行符
  let text = sourceText
    .replace(/\n|\r/g, "")
  let $ = cheerio.load(text)
  // 判断是否是 PC 上导出的 html 文件
  // 有 class 是 noteHeading 的 < h3 > 标签的就是从 PC 端导出的
  if ($('h3.noteHeading').length) {
    // 处理标签闭合问题
    // 替换顺序不能换，否则之前替换好的又会被覆盖
    text = text.replace(/<\/h3>/g, "</div>")
              .replace(/<\/div><div class='noteText'>/g, "</h3><div class='noteText'>")
    $ = cheerio.load(text)
  }

  let titleNode = $('.bookTitle')[0]
  const title = $(titleNode)
    .text()
    .trim()
  const texts = []
  const nodes = Array.from($('.noteText'))
  const tempNotes = []
  while (nodes.length) {
    const element = nodes.pop()
    const type = getType(element.prev.children[0].data)
    const text = element.children
      .filter(i => i.type === 'text')
      .map(i => i.data.trim())
      .join('')
    if (type === 2) {
      tempNotes.push(text)
    }
    if (type === 1) {
      texts.unshift({
        text,
        note: tempNotes.pop() || '',
        checked: false,
        isEdit: false
      })
    }
  }
  return {
    title,
    texts
  }
}

export default readFile
