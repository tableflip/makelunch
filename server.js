var startedAt = Date.now()
var config = require('config')
var path = require('path')
var db = require('./lib/db')
var app = require('./lib/server')
var ecstatic = require('ecstatic')

// Load the routes
var routes = require('./routes')().map(name => {
  return require('./routes/' + name + '/server')
})

console.log(`
                 _                  _
|\\/|   /\\   |/  |_  |   | |  |\\ |  /   |_|
|  |  /--\\  |\\  |_  |_  |_|  | \\|  \\_  | |
`)
console.log('Connecting to rethink:', config.rethink)

db(config.rethink, (err, conn) => {
  if (err) {
    console.error('Error starting rethink:', err.message)
    process.exit(-1)
  }

  // Let each route mount itself
  routes.map(route => { route(app, conn) })
  app.use(ecstatic({root: path.join(__dirname, 'public')}))

  var server = app.listen(config.port, config.host, () => {
    var host = server.address().address
    var port = server.address().port
    console.log('Server running: http://%s:%s', host, port)
    console.log('Startup time: %sms | NODE_ENV: %s ', Date.now() - startedAt, process.env.NODE_ENV)
  })
})
