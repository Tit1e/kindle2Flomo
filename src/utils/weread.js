import { get_bookshelf, get_bookmarklist, get_reviewlist } from '@/utils/wereadRequest.js'

export function getBookshelf(cookie) {
  return new Promise((resolve, reject) => {
    get_bookshelf(cookie).then(res => {
     const list = res.recentBooks.map(i => {
        return {
          title: i.title,
          loaded: false,
          bookId: i.bookId,
          texts: []
        }
     })
     resolve(list)
    }).catch(e => {
      reject(e)
    })
  })
}

export function getBookMarkList(bookId) {
  return new Promise((resolve, reject) => {
    get_bookmarklist(bookId).then(res => {
      let list = res.updated.map(i => {
        return {
          text: i.markText,
          note: '',
          checked: false,
          isEdit: false
        }
      })
      resolve(list)
    }).catch(e => {
      reject(e)
    })
  })
}

export function getReviewList(params, cookie) {
  return new Promise((resolve, reject) => {
    get_reviewlist(params, cookie).then(res => {
      let list = res.reviews.map(i => {
        return {
          text: i.review.abstract,
          note: i.review.content || '',
          checked: false,
          isEdit: false
        }
      })
      resolve(list)
    }).catch(e => {
      reject(e)
    })
  })
}

