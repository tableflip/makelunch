Template.meals.events = {
  'click .meal .tint': function (e) {
    $('.meal').removeClass('visible')
    $(e.currentTarget).closest('.meal').addClass('visible')
  }
}