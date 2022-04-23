import { dexieGet, dexieAdd } from '@/db/dexie'
import md5 from 'md5'
import init from '@/utils/init.js'
let fs = {}
let os = {}
let bplist = {}
let db = function () {}
let readSQLite = function () {
  return Promise.resolve(true)
}
// electron 环境才加载模块
if (process.env.IS_ELECTRON) {
  fs = require('fs')
  os = require('os')
  bplist = require('bplist-parser')
  db = require('@/db/sqlite.js').db
  readSQLite = function () {
    const homedir = os.homedir()
    const path = '/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/'
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
          AND ZANNOTATIONDELETED = 0
          ORDER BY ZANNOTATIONASSETID ASC
        `,
        async function (err, res) {
          if (!err) {
            const plistPath = `${homedir}/Library/Containers/com.apple.BKAgentService/Data/Documents/iBooks/Books/Books.plist`
            let plistData = {}
            let books = []
            try {
              // 获取图书列表并添加至数据库
              const tmpData = await bplist.parseFile(plistPath)
              plistData = tmpData[0]
              if (plistData && plistData.Books && plistData.Books.length) {
                books = plistData.Books
                for (let i = 0; i < plistData.Books.length; i++) {
                  const {itemName} = plistData.Books[i]
                  const title = itemName
                  const uuid = md5(title)
                  let bookInfo = {
                    uuid,
                    title,
                    book: title,
                    form: 'applebooks',
                  }
                  const res = await dexieGet(uuid, 'books')
                  if (!res) {
                    await dexieAdd(bookInfo, 'books')
                  }
                }
              }
            } catch (error) {
              console.log(error)
              reject('图书列表解析出错')
            }
            if (res.length) {
              try {
                for (let d = 0; d < res.length; d++) {
                  const i = res[d]
                  const index = books.findIndex( v => v.BKGeneratedItemId === i.ZANNOTATIONASSETID)
                  if (index > -1) {
                    const title = books[index].itemName
                    const text = i.SelectedText
                    const note = i.Note || ''
                    const uuid = md5(`${title}${text}`)
                    let noteItem = {
                      uuid,
                      title,
                      text,
                      note,
                      content_update: '',
                      uploaded: false,
                      form: 'applebooks'
                    }
                    const res = await dexieGet(uuid)
                    if (!res) {
                      await dexieAdd(noteItem)
                    }
                  }
                }
              } catch (error) {
                console.log(error)
              }
            }
            await init(books.map(i => i.itemName))
            resolve(true)
          } else {
            reject('笔记解析出错')
          }
        }
      )
    })
  }
}

export default readSQLite
