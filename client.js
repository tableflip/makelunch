var page = require('page')

var routes = [
  require('./routes/home/client'),
  require('./routes/join/client')
]
// Let each route mount itself
routes.map(route => { route(page) })

// Initialise the client side router.
page()
