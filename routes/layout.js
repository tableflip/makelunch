var manifest = require('../lib/manifest')()
var layoutTpl = require('./layout.jade')

module.exports = function (title, content) {
  var data = {
    title: title,
    content: content,
    manifest: manifest
  }
  return layoutTpl(data)
}
