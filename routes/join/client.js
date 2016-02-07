var $ = require('jquery')
var tpl = require('./join.jade')

module.exports = function (app) {
  app('/join', (ctx, next) => {
    if ($('#page').hasClass('join')) return
    $('#content').empty().append(tpl())
  })
}
