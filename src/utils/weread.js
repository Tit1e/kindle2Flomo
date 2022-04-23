import {
  get_bookshelf,
  get_bookmarklist,
  get_reviewlist,
  get_notebooklist
} from '@/utils/wereadRequest.js'
import init from '@/utils/init.js'

import dexie, { dexieGet, dexieAdd } from '@/db/dexie'
import md5 from 'md5'
import { addField } from '@/utils/utils'

function clearCookies () {
  const { session } = require('@electron/remote')
  return new Promise((r, j) => {
    session.defaultSession.cookies
      .get({ url: 'https://weread.qq.com/' })
      .then(res => {
        try {
          for (var i = 0; i < res.length; i++) {
            session.defaultSession.cookies.remove(
              'https://weread.qq.com/',
              res[i].name,
              error => {
                //判断是否error
                console.log('cookie 清除出错')
              }
            )
          }
          r()
        } catch (error) {
          j()
        }
      })
      .catch(() => j())
  })
}

export async function getNotebooklist() {
  try {
    const res = await get_notebooklist()
    const books = res.books
    if (books && books.length) {
      for (let d = 0; d < books.length; d++) {
        const i = books[d]
        const title = i.book.title
        const bookId = i.bookId
        const uuid = md5(title)
        const bookInfo = {
          uuid,
          title,
          form: 'weread',
          book: title,
          bookId
        }
        const res = await dexieGet(uuid, 'books')
        if (!res) {
          await dexieAdd(bookInfo, 'books')
        }
      }
      return books.map(i => i.book)
    } else {
      return Promise.reject([])
    }
  } catch (error) {
    if (error === 401) clearCookies()
    return Promise.reject(error)
  }
}

export async function getBookMarkList(bookId, title) {
  try {
    const res = await get_bookmarklist(bookId)
    if(res.errcode === -2012) return Promise.reject(401)
    const result = res.updated
    for (let d = 0; d < result.length; d++) {
      const i = result[d]
      const uuid = md5(`${title}${i.markText}`)
      const text = i.markText
      const note = ''
      let noteItem = {
        uuid,
        title,
        text,
        note,
        content_update: '',
        uploaded: false,
        form: 'weread'
      }
      const res = await dexieGet(uuid)
      if(!res) await dexieAdd(noteItem)
    }
    return true
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function getReviewList({ title, ...params }) {
  try {
    const res = await get_reviewlist(params)
    if(res.errcode === -2012) return Promise.reject(401)
    const result = res.reviews
    for(let d = 0; d < result.length; d++) {
      const i = result[d]
      const text = i.review.abstract
      const uuid = md5(`${title}${text}`)
      const note = i.review.content || ''
      let noteItem = {
        uuid,
        title,
        text,
        note,
        content_update: '',
        uploaded: false,
        form: 'weread'
      }
      const res = await dexieGet(uuid)
      if(!res) await dexieAdd(noteItem)
    }
    return true
  } catch (error) {
    return Promise.reject(error)
  }
}
