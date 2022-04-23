const cheerio = require('cheerio')
import md5 from 'md5'
import { getType } from './paresClip'
import { dexieGet, dexieAdd } from '@/db/dexie'
import init from '@/utils/init.js'

async function readFile (sourceText) {
  // 除字符串内所有的换行符
  let text = sourceText.replace(/\n|\r/g, '')
  let $ = cheerio.load(text)
  // 判断是否是 PC 上导出的 html 文件
  // 有 class 是 noteHeading 的 < h3 > 标签的就是从 PC 端导出的
  if ($('h3.noteHeading').length) {
    // 处理标签闭合问题
    // 替换顺序不能换，否则之前替换好的又会被覆盖
    text = text
      .replace(/<\/h3>/g, '</div>')
      .replace(/<\/div><div class='noteText'>/g, "</h3><div class='noteText'>")
    $ = cheerio.load(text)
  }

  let titleNode = $('.bookTitle')[0]
  const title = $(titleNode)
    .text()
    .trim()
  const nodes = Array.from($('.noteText'))
  const lastIndex = nodes.length - 1
  const tempNotes = []
  for (let i = lastIndex; i >= 0; i--) {
    const element = nodes[i]
    const type = getType(element.prev.children[0].data)
    const text = element.children
      .filter(i => i.type === 'text')
      .map(i => i.data.trim())
      .join('')
    if (type === 2) {
      tempNotes.push(text)
    }
    if (type === 1) {
      const uuid = md5(`${title}${text}`)
      const note = tempNotes.pop() || ''
      const noteItem = {
        uuid,
        title,
        text,
        note,
        content_update: '',
        uploaded: false,
        from: 'html'
      }
      const res = await dexieGet(uuid)
      // 数据已存在直接返回数据
      if (!res) {
        await dexieAdd(noteItem)
      }
    }
  }
  const uuid = md5(title)
  const bookInfo = {
    uuid,
    title,
    book: title,
    from: 'html'
  }
  const res = await dexieGet(uuid, 'books')
  if (!res) {
    await dexieAdd(bookInfo, 'books')
  }
  await init([title])
  return true
}

export default readFile
