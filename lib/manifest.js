module.exports = function () {
  if (process.env.NODE_ENV === 'production') {
    return require('../public/manifest.json')
  }
  return { 'bundle.js': 'bundle.js', 'bundle.css': 'bundle.css' }
}
