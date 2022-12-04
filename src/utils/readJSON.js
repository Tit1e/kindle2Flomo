import { dexieGet, dexieAdd } from '@/db/dexie'
import md5 from 'md5'
import init from '@/utils/init.js'



async function parseBook (bookData) {
  try {
    const { entries, title } = bookData
    const uuid = md5(title)
    let bookInfo = {
      uuid,
      title,
      book: title,
      from: 'koreader'
    }
    const res = await dexieGet(uuid, 'books')
    if (!res) {
      await dexieAdd(bookInfo, 'books')
    }

    if (entries && entries.length) {
      for (let i = 0; i < entries.length; i++) {
        const { text } = entries[i]
        const uuid = md5(`${title}${text}`)
        let noteItem = {
          uuid,
          title,
          text,
          note: '',
          content_update: '',
          uploaded: false,
          from: 'koreader'
        }
        const res = await dexieGet(uuid)
        if (!res) {
          await dexieAdd(noteItem)
        }
      }
    }
    await init([title])
    return true
  } catch (error) {
    return Promise.reject(error)
  }
}

export default async function readJSON(str) {
  const _str = JSON.parse(str)
  console.log(_str)
  if (_str.documents && Array.isArray(_str.documents)) {
    for (let i = 0; i < _str.documents.length; i++) {
      await parseBook(_str.documents[i])
    }
  }
  if (_str.entries && _str.entries.length) {
    await parseBook(_str)
  }
}
