Template.addmeal.events({
  'submit': function (evt, tpl) {
    evt.preventDefault()

    var meal = {
      date: tpl.find('.mealDate').value,
      chef: $('.chef').map(function(i, dom) { return $(dom).data('eater')}).get(),
      eaters: $('.eating').map(function(i, dom) { return $(dom).data('eater')}).get(),
      guests: parseInt(tpl.find('.mealGuests').value, 10),
      dish: tpl.find('.mealDish').value
    }

    console.log(meal)
    Meals.insert(meal)
    Router.go('meals')
  },
  'dblclick .mealEaters .card': function(evt, tpl) {
    var card = $(evt.currentTarget)
    console.log(card)
    card.toggleClass('chef')
    card.addClass('eating')
  },
  'click .mealEaters .card': function (evt, tpl) {
    var card = $(evt.currentTarget)
    card.toggleClass('eating')
  }
})