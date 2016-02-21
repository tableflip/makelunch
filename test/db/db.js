var db = require('../../db')
var r = require('rethinkdb')
var test = require('tape')

var dbConn

// Test requries a rethink db is running on localhost:28015
test('Can init rethink', function (t) {
  db.init(db._test.config, (err, conn) => {
    dbConn = conn
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

test('Can create user from twitter', function (t) {
  var twitterUser = {
    id_str: 'woohaa',
    name: 'Alphonso',
    screen_name: 'alp',
    profile_image_url_https: 'http://roflzoo.com/pics/201409/cat-chilling-on-the-sidewalk.jpg',
    lang: 'Esperanto'
  }
  db.twitter.findOrCreateUser('t', 'ts', twitterUser, (err, user) => {
    t.error(err, 'user created from twitter details')
    t.equals(user.profile.name, twitterUser.name)
    t.equals(user.profile.lang, twitterUser.lang)
    t.equals(user.profile.image, twitterUser.profile_image_url_https)
    var service = user.services.twitter
    t.equals(service.id, twitterUser.id_str)
    t.equals(service.token, 't')
    t.equals(service.tokenSecret, 'ts')
    t.end()
  })
})

// expects user to have been created in previous test.
test('Can update user from twitter', function (t) {
  var twitterUser = {
    id_str: 'woohaa',
    name: 'Alphonso Hotdog',
    screen_name: 'alpodog',
    profile_image_url_https: 'http://roflzoo.com/pics/201409/cat-chilling-on-the-sidewalk.jpg',
    lang: 'Esperanto'
  }
  db.twitter.findOrCreateUser('t2', 'ts2', twitterUser, (err, user) => {
    t.error(err, 'user created from twitter details')
    t.equals(user.profile.name, twitterUser.name)
    t.equals(user.profile.lang, twitterUser.lang)
    t.equals(user.profile.photos[0], twitterUser.profile_image_url_https)
    var service = user.services.twitter
    t.equals(service.id, twitterUser.id_str)
    t.equals(service.token, 't2')
    t.equals(service.tokenSecret, 'ts2')
    db.users.findById(user.id, (err, user2) => {
      t.error(err, 'can find user by id')
      t.deepEquals(user, user2)
    })
    db.users.count((err, num) => {
      t.error(err, 'can count users')
      t.equals(num, 1, 'did update user')
    })
    r.table('users').get(user.id).delete().run(dbConn, (err, res) => {
      t.error(err, 'can delete user')
      t.equals(res.deleted, 1, 'did delete user')
    })
    t.end()
  })
})
