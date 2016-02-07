var layout = require('../layout')
var tpl = require('./home.jade')

module.exports = function (app) {
  app.get('/', (req, res, next) => {
    res.send(layout('home', tpl()))
  })
}
