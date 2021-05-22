const fs = require('fs')
const cheerio  = require('cheerio')
function readFile (filePath) {
  //获取本地json文件的路径, __dirname 代表的是html页面的路径地址
  let document = fs.readFileSync(filePath).toString()
  const $ = cheerio.load(document)
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