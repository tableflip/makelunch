/*

**users**

```js
profile: {
  groups: [
    {
      _id: "foo",
      name: "JAILmake",
      slug: "jailmake",
      photo: "logo.png",
      stats: {
        servings: {
          given: Number,
          received: Number
        },
        meals: {
          cooked: [mealId]
          attended: [mealId]
        }
      }
    }
  ]
}
services: {
  twitter: {

  }
}
```
*/
var r = require('rethinkdb')
var jwt = require('jsonwebtoken')
var config = require('config')

module.exports.findById = function (conn, id, done) {
  // plan user props that should be exposed
  r.table('users').get(id).default({}).run(conn, done)
}

module.exports.count = function (conn, done) {
  r.table('users').count().run(conn, done)
}

module.exports.createAuthToken = function (conn, id, userAgent, done) {
  var token = jwt.sign({ userId: id }, config.jwtSecret, { algorithm: 'HS256' })
  var data = { token: token, userAgent: userAgent }
  data.createdAt = new Date()
  data.lastSeen = data.createdAt
  r.table('users').get(id).update({
    tokens: r.row('tokens').append(data)
  }).run(conn, (err, res) => {
    if (err) return done(err)
    done(null, token)
  })
}
