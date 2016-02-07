var $ = require('jquery')
var tpl = require('./home.jade')

module.exports = function (app) {
  app('/', (ctx, next) => {
    if ($('#page').hasClass('home')) return
    $('#content').empty().append(tpl())
  })
}
