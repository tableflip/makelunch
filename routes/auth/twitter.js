var r = require('rethinkdb')
var config = require('config')
var passport = require('passport')
var session = require('express-session')
var twitter = require('passport-twitter')
var opts = {
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: config.url + '/auth/twitter/callback'
}

module.exports = function (app, conn) {
  app.use(session({ secret: 'beep boop', resave: false, saveUninitialized: false }))
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new twitter.Strategy(opts, findOrCreateUser.bind(null, conn)))
  app.get('/auth/twitter', passport.authenticate('twitter'))
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/auth'
    })
  )
}

function findOrCreateUser (conn, token, tokenSecret, profile, done) {
  var authId = 'twitter-' + profile.id
  r.table('auths').get(authId).run(conn, (err, auth) => {
    if (err) done(err)
    if (auth && auth.userId) return r.table('users').get(auth.userId).run(conn, done)
    // A new challenger appears. Create new auth and user.
    r.table('users').insert({profile: profile}, {returnChanges: true}).run(conn, (err, res) => {
      if (err) done(err)
      var user = res.changes[0].new_val
      r.table('auths').insert({
        id: authId,
        userId: user.id,
        profile: profile,
        token: token,
        tokenSecret: tokenSecret
      }).run(conn, (err) => {
        done(err, user)
      })
    })
  })
}

// For testing porpoises.
module.exports.findOrCreateUser = findOrCreateUser
