require.extensions['.jade'] = function (module, filename) {
  var src = 'var jade = require(\'jade\');'
  src += 'module.exports = jade.compileFile(\'' + filename + '\')'
  module._compile(src, filename)
}
