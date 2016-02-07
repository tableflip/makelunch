var fs = require('fs')
var path = require('path')

module.exports = function () {
  return fs.readdirSync(__dirname).filter(name => {
    return fs.statSync(path.join(__dirname, name)).isDirectory()
  })
}
