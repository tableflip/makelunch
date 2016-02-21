var r = require('rethinkdb')
require('rethinkdb-init')(r)
var mods = require('require-dir')()
var tables = ['users', 'groups', 'meals']

// dbConfig: { host: 'localhost', port: 28015, db: 'makelunch'}
module.exports.init = function init (dbConfig, cb) {
  r.init(dbConfig, tables)
    .catch(cb)
    .then(conn => {
      // Bind conn to all the things
      Object.keys(mods).reduce((obj, name) => {
        var mod = mods[name]
        obj[name] = (typeof mod === 'function') ? mod.bind(null, conn) : {}
        Object.keys(mod).forEach(k => {
          if (typeof mod[k] !== 'function') return
          obj[name][k] = mod[k].bind(null, conn)
        })
        return obj
      }, module.exports)
      cb(null, conn)
    })
}

module.exports.tableNames = function () {
  return tables.slice()
}

module.exports._test = {
  config: { host: 'localhost', port: 28015, db: 'makeunch_test' },
  destroy: function (conn, cb) {
    conn
    r.dbDrop(module.exports._test.config.db).run(conn, (err1) => {
      conn.close(err2 => { cb(err1 || err2) })
    })
  }
}
