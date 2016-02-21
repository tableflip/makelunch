var r = require('rethinkdb')

function toUser (token, tokenSecret, profile) {
  return {
    profile: {
      name: profile.name,
      photos: [profile.profile_image_url_https],
      lang: profile.lang
    },
    emails: [],
    services: {
      twitter: {
        id: profile.id_str,
        name: profile.name,
        screenName: profile.screen_name,
        profileImage: profile.profile_image_url_https,
        lang: profile.lang,
        token: token,
        tokenSecret: tokenSecret
      }
    }
  }
}

function createUser (conn, token, tokenSecret, profile, done) {
  var user = toUser(token, tokenSecret, profile)
  user.createdAt = new Date()
  user.updatedAt = user.createdAt

  r.table('users').insert(user, {returnChanges: true}).run(conn, (err, res) => {
    if (err) return done(err)
    return done(null, res.changes[0].new_val)
  })
}

function updateUser (conn, id, token, tokenSecret, profile, done) {
  var user = toUser(token, tokenSecret, profile)
  user.updatedAt = new Date()

  r.table('users').get(id).update(user, {returnChanges: true}).run(conn, (err, res) => {
    if (err) return done(err)
    return done(null, res.changes[0].new_val)
  })
}

module.exports.findOrCreateUser = function (conn, token, tokenSecret, profile, done) {
  r.table('users').filter({services: {twitter: {id: profile.id_str}}})
    .run(conn, (err, cursor) => {
      if (err) return done(err)
      cursor.toArray((err, res) => {
        if (err) return done(err)
        if (res.length) return updateUser(conn, res[0].id, token, tokenSecret, profile, done)
        return createUser(conn, token, tokenSecret, profile, done)
      })
    })
}
