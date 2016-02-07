var db = require('../../../lib/db')
var twitter = require('../../../routes/auth/twitter')
var test = require('tape')
var r = require('rethinkdb')

// Test requries a rethink db is running on localhost:28015
test('Can init rethink', function (t) {
  db(db._test.config, (err, conn) => {
    t.error(err, 'Created db')
    test.onFinish(db._test.destroy.bind(null, conn, err => { t.error(err, 'Dropped db') }))
    twitter.findOrCreateUser(conn, 'test-token', 'test-token-secret', { name: 'Georg Hackenschmidt' }, (err, user) => {
      t.error(err, 'Created user')
      t.deepEquals(user.profile, { name: 'Georg Hackenschmidt' }, 'Retrieved profile')
      r.table('auths').filter({ userId: user.id }).run(conn, (err, cursor) => {
        t.error(err, 'Created auth')
        cursor.toArray((err, res) => {
          t.error(err, 'Retrieved auth')
          var auth = res[0]
          t.equals(auth.token, 'test-token', 'Retrieved auth token')
          t.equals(auth.tokenSecret, 'test-token-secret', 'Retrieved auth tokenSecret')
          r.table('users').count().run(conn, (e, res) => {
            t.equals(res, 1, 'Only 1 user created')
            r.table('auths').count().run(conn, (e, res) => {
              t.equals(res, 1, 'Only 1 auth created')
              t.end()
            })
          })
        })
      })
    })
  })
})
