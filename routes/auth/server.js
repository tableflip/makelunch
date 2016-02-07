var twitter = require('./twitter')

module.exports = function (app, conn) {
  twitter(app, conn)
}
