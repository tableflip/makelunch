Template.meals.events = {
  'click .meal': function (e) {
    $('.meal').removeClass('visible')
    $(e.currentTarget).addClass('visible')
  }
}