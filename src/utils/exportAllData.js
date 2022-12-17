import { dexieList } from '@/db/dexie'
export default async function exportAllData() {
  let books = await dexieList('books')
  books = (books || []).map(i => {
    delete i.id
    // 修正字段
    if (i.form) {
      i.form = i.form
      delete i.form
    }
    return i
  })
  console.log(books)
  let notes = await dexieList('notes')
  notes = (notes || []).map(i => {
    delete i.id
    if (i.form) {
      i.form = i.form
      delete i.form
    }
    return i
  })
  const content = JSON.stringify({
    from: 'send2Flomo',
    books,
    notes
  })
  const blob = new Blob([ content ], { type: 'text/json' })
    const objectURL = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectURL
    a.download = `send2Flomo-export.json`
    a.click()
    URL.revokeObjectURL(objectURL)
}