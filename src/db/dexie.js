import Dexie from 'dexie'

function nodeDB () {
  const db = new Dexie('booknotes')
  db.version(1).stores({
    notes: '++id, uuid, title',
    books: '++id, uuid, title'
  })
  return db
}

const _nodeDB = nodeDB()

export async function dexieGet(uuid, table = 'notes') {
  const res = await _nodeDB[table].where('uuid').equals(uuid).toArray()
  return res ? res[0] : null
}

export async function dexieList(table = 'notes') {
  return await _nodeDB[table].reverse().toArray()
}

export async function dexieGetListByTitle(title, table = 'notes') {
  return await _nodeDB[table].where("title").equals(title).toArray()
}

export async function dexieAdd(Obj, table = 'notes') {
  if (Obj instanceof Array) {
    return await _nodeDB[table].bulkAdd(Obj)
  }
  return await _nodeDB[table].add(Obj)
}

export async function dexiePut(Obj, table = 'notes') {
  return await _nodeDB[table].put(Obj)
}