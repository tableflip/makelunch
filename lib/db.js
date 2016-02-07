var r = require('rethinkdb')
var tables = ['auths', 'users', 'groups', 'meals']
require('rethinkdb-init')(r)

// dbConfig: { host: 'localhost', port: 28015, db: 'makelunch'}
module.exports = function init (dbConfig, cb) {
  r.init(dbConfig, tables)
    .then(conn => cb(null, conn))
    .catch(cb)
}

module.exports.tableNames = function () {
  return tables.slice()
}

module.exports._test = {
  config: { host: 'localhost', port: 28015, db: 'makeunch_test' },
  destroy: function (conn, cb) {
    r.dbDrop(module.exports._test.config.db).run(conn, (err1) => {
      conn.close(err2 => { cb(err1 || err2) })
    })
  }
}
