let fs = {}
let os = {}
let bplist = {}
let db = function () {}
let readSQLite = function () {
  return Promise.resolve([])
}
// electron 环境才加载模块
if (process.env.IS_ELECTRON) {
  fs = require('fs')
  os = require('os')
  bplist = require('bplist-parser')
  db = require('@/db/sqlite.js').db
  readSQLite = function () {
    const homedir = os.homedir()
    // const path = '/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/'
    const path = '/Desktop/text/'
    let files = ''
    try {
      files = fs.readdirSync(`${homedir}${path}`)
    } catch (error) {
      return Promise.reject('未发现笔记文件')
    }
    const fileName = files.find(i => i.slice(-6).toLowerCase() === 'sqlite')
    if (!fileName) {
      return Promise.reject('未发现笔记文件')
    }
    const dataBase = db(`${homedir}${path}`, fileName)
    return new Promise((resolve, reject) => {
      dataBase.all(
        `
          SELECT
              ZANNOTATIONREPRESENTATIVETEXT as BroaderText,
              ZANNOTATIONSELECTEDTEXT as SelectedText,
              ZANNOTATIONNOTE as Note,
              ZFUTUREPROOFING5 as Chapter,
              ZANNOTATIONCREATIONDATE as Created,
              ZANNOTATIONMODIFICATIONDATE as Modified,
              ZANNOTATIONASSETID
          FROM ZAEANNOTATION
          WHERE ZANNOTATIONSELECTEDTEXT IS NOT NULL
          ORDER BY ZANNOTATIONASSETID ASC
        `,
        async function (err, res) {
          if (!err) {
            // const plistPath = `${homedir}/Library/Containers/com.apple.BKAgentService/Data/Documents/iBooks/Books/Books.plist`
            const plistPath = `${homedir}/Desktop/text/Books.plist`
            let plistData = {}
            let books = []
            try {
              const tmpData = await bplist.parseFile(plistPath)
              plistData = tmpData[0]
              books = plistData.Books
            } catch (error) {
              console.log(error)
              reject('图书列表解析出错')
            }

            try {
              res.forEach(i => {
                const index = books.findIndex(
                  v => v.BKGeneratedItemId === i.ZANNOTATIONASSETID
                )
                if (index >= 0) {
                  const data = {
                    text: i.SelectedText,
                    note: i.Note,
                    checked: false,
                    isEdit: false
                  }
                  try {
                    books[index].texts.push(data)
                  } catch (error) {
                    books[index].texts = []
                    books[index].texts.push(data)
                  }
                }
              })
            } catch (error) {
              console.log(error)
            }
            resolve(
              books.filter(i => i.texts).map(j => {
                return {
                  title: j.BKDisplayName,
                  texts: j.texts
                }
              })
            )
          } else {
            reject('笔记解析出错')
          }
        }
      )
    })
  }
}

export default readSQLite
