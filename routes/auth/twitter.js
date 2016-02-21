var config = require('config')
var passport = require('passport')
var session = require('express-session')
var twitter = require('passport-twitter')
var opts = {
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: config.url + '/auth/twitter/callback'
}

module.exports = function (app, db) {
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => db.users.findById(id, done))
  passport.use(new twitter.Strategy(opts, (token, tokenSecret, profile, done) => {
    setImmediate(() => db.twitter.findOrCreateUser(token, tokenSecret, profile._json, done))
  }))

  app.use(session({ secret: 'beep boop', resave: false, saveUninitialized: false }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/auth/twitter', passport.authenticate('twitter'))
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    function onSuccess (req, res) {
      db.user.createAuthToken(req.user.id, req.headers['user-agent'])
      //
      res.redirect('/?' + req.user.profile.name)
    }
  )
}
