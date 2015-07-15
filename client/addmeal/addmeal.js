Template.addmeal.onCreated(function() {
  this.error = new ReactiveVar()
})

Template.addmeal.helpers({
  error: function() { return Template.instance().error.get() }
})

Template.addmeal.events({
  'submit': function (evt, tpl) {
    evt.preventDefault()
    tpl.error.set(null)

    var meal = {
      date: tpl.find('.mealDate').value,
      chef: $('.chef').map(function(i, dom) { return $(dom).data('eater')}).get(),
      eaters: $('.eating').map(function(i, dom) { return $(dom).data('eater')}).get(),
      guests: parseInt(tpl.find('.mealGuests').value, 10),
      dish: tpl.find('.mealDish').value
    }

    if (!meal.chef.length) tpl.error.set('You need to choose a chef')
    else {
      Meals.insert(meal)
      Router.go('meals')
    }
  },

  'click .mealEaters .card': function (evt, tpl) {
    var card = $(evt.currentTarget)

    if (card.hasClass('chef')) card.removeClass('chef eating')
      else if (card.hasClass('eating')) card.addClass('chef')
      else if (!card.hasClass('eating')) card.addClass('eating')
  }
})
