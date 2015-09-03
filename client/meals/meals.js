Template.meals.events = {
  'click .meal': function (e) {
    console.log(e)
    $('.meal').removeClass('visible')
    $(e.currentTarget).addClass('visible')
  }
}