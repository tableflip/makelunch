var db = require('../lib/db')
var r = require('rethinkdb')
var test = require('tape')

// Test requries a rethink db is running on localhost:28015
test('Can init rethink', function (t) {
  db(db._test.config, (err, conn) => {
    t.error(err, 'Created db')
    test.onFinish(db._test.destroy.bind(null, conn, err => { t.error(err, 'Dropped db') }))
    r.db(db._test.config.db).tableList().run(conn, (err, res) => {
      t.error(err, 'Listed tables')
      db.tableNames().map(name => {
        t.ok(res.indexOf(name) > -1, 'Table ' + name + ' exists')
      })
      t.end()
    })
  })
})
