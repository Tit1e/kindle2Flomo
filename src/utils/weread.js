import { get_bookshelf, get_bookmarklist, get_reviewlist, get_notebooklist } from '@/utils/wereadRequest.js'

function clearCookies(){
  const { session } = require('electron').remote
  return new Promise((r, j) => {
    session.defaultSession.cookies.get({ url: 'https://weread.qq.com/' }).then(res => {
      try {
        for (var i = 0; i < res.length; i++) {
          session.defaultSession.cookies.remove(
            'https://weread.qq.com/',
            res[i].name,
            (error) => {
              //判断是否error
              console.log('cookie 清除出错')
            }
          )
        }
        r()
      } catch (error) {
        j()
      }
    }).catch(() => j())
  })
}


export function getNotebooklist() {
  return new Promise((resolve, reject) => {
    get_notebooklist().then(res => {
     const list = res.books.map(i => {
        return {
          title: i.book.title,
          loaded: false,
          bookId: i.bookId,
          texts: []
        }
     })
     resolve(list)
    }).catch(e => {
      if(e === 401) clearCookies()
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

export function getReviewList(params, ) {
  return new Promise((resolve, reject) => {
    get_reviewlist(params).then(res => {
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

