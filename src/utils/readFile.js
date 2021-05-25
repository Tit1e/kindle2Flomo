const cheerio = require('cheerio')
import { getType } from './paresClip'
function readFile (text) {
  const $ = cheerio.load(text)
  let titleNode = $('.bookTitle')[0]
  const title = $(titleNode)
    .text()
    .trim()
  const texts = []
  const nodes = Array.from($('.noteText'))
  const tempNotes = []
  while (nodes.length) {
    const element = nodes.pop()
    const type = getType(element.prev.prev.children[0].data)
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
