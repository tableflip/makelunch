Template.eater.events = {
  'click .meal': function (e) {
    if ($('#responsive-detect-xs').css('display') !== 'block') return
    $('.meal').removeClass('visible')
    $(e.currentTarget).addClass('visible')
  },
  'click .btn-on-the-rye': function (evt, tpl){
    evt.preventDefault()
    var newStatus = (tpl.data.eater.status !== 'rye') ? 'rye' : 'jail'
    Eaters.update(tpl.data.eater._id, { $set: {status: newStatus}})
  }
}

Template.eater.onRendered(function () {
  $(window).on('resize', _.debounce(function () {
    if ($('#responsive-detect-xs').css('display') !== 'block')
      $('.meal').removeClass('visible')
  }, 250))
})