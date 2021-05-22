const cheerio  = require('cheerio')
function readFile(text) {
  const $ = cheerio.load(text)
  let titleNode = $('.bookTitle')[0]
  const title = $(titleNode).text().trim()
  const texts = []
  const nodes = $('.noteText')
  nodes.each((i, element) => {
    // 过滤标注信息
    const text = element.children.filter(i => i.type ===  'text').map(i => i.data.trim()).join('')
    texts.push({
      text,
      checked: false
    })
  })
  return {
    title,
    texts
  }
}

export default readFile