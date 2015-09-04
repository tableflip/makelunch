Template.eater.events = {
  'click .meal': function (e) {
    if ($('#responsive-detect-xs').css('display') !== 'block') return
    $('.meal').removeClass('visible')
    $(e.currentTarget).addClass('visible')
  }
}

Template.eater.onRendered(function () {
  $(window).on('resize', _.debounce(function () {
    if ($('#responsive-detect-xs').css('display') !== 'block')
      $('.meal').removeClass('visible')
  }, 250))
})