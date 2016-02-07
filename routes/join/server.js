var layout = require('../layout')
var tpl = require('./join.jade')

module.exports = function (app) {
  app.get('/join', (req, res, next) => {
    res.send(layout('home', tpl()))
  })
}
