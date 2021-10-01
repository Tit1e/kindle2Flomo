const sqlite3 = require('sqlite3').verbose();
const path = require('path')

const db = function (_path, name) {
  return new sqlite3.Database(path.join(_path, name))
}


module.exports = {
  db
}