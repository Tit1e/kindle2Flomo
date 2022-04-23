import { dexieList, dexieGetListByTitle } from '@/db/dexie'
import { addField } from '@/utils/utils'
import store from '@/store/index.ts'
async function init(sortList = [], sort = true) {
  const books = await dexieList('books')
  const result = []
  for (let i = 0; i < books.length; i++) {
    const book = books[i]
    const texts = await dexieGetListByTitle(book.title)
    result.push({
      ...book,
      texts: addField(texts)
    })
  }
  if (sort && sortList.length) {
    for (let i = 0; i < sortList.length; i++) {
      const item = sortList[i]
      const index = result.findIndex(i => i.title === item)
      result.unshift(result.splice(index, 1)[0])
    }
  }
  store.commit('SET_BOOK_LIST', result)
  return result
}

export default init