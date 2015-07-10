MakeLunch = {} // our global for helpers

Meteor.subscribe('eaters')
Meteor.subscribe('meals')

Meteor.startup(function () {

  Router.configure({
    layoutTemplate: 'layout'
  })

  Router.map(function () {

    this.route('home', {
      path:'/' ,
      data: function () {
        return {
          eaters: Eaters.sorted({status:'jail'}),
          mia: Eaters.find({status:'rye'}).fetch(),
          date: todaysDate(),
          whoShouldCook: whoShouldCook()
        }
      }
    })

    this.route('addmeal', {
      path:'/addmeal',
      data: function () {
        return {
          people: Eaters.find({status:'jail'}),
        }
      }
    })

    this.route('editmeal', {
      path:'/editmeal/:_id',
      data: function () {
        var meal = Meals.findOne(this.params._id)
        console.log(meal)
        return {
          meal: meal,
          eaters: Eaters.find({_id: {$in: meal.eaters, $nin: meal.chef}}),
          chefs: Eaters.find({_id: {$in: meal.chef}}),
          people: Eaters.find({_id: {$nin: meal.eaters}, status: 'jail'})
        }
      }
    })

    this.route('editperson', {
      path: '/editperson/:_id',
      data: function() {
        return Eaters.findOne(this.params._id)
      }
    })

    this.route('addperson')

    this.route('meals', {
      path:'/meals',
      onBeforeAction: [
        function () {
          this.subscribe('meals')
          this.next()
        }
      ],
      data: function () {
        return {
          meals: Meals.find({}, {sort: {date: -1}}).fetch()
        }
      }
    })
    
    this.route('tomorrow', {
      path:'/tomorrow/:hash',
      onBeforeAction: function () {
        if (!Meteor.userId()) Router.go('home')
        this.next()
      },
      data: function () {
        return {
          chef: Eaters.findOne({'auth.twitter': Meteor.user().services.twitter.screenName})
        }
      }
    })
  })// end router.map

  //registerHelpers
  UI.registerHelper('scoreSummary', Eaters.scoreSummary)
})// end Meteor.startup

UI.registerHelper('fromNow', function (date) {
  return moment(date + 'T12:00').fromNow()
})

UI.registerHelper('profile', function (userId) {
  var eater = Eaters.findOne(userId)
  eater.img = eater.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(eater.name) + "?s=300&d=monsterid"
  return eater
})

UI.registerHelper('score', function (eater) {
  return eater.servings.given - eater.servings.received
})

function whoShouldCook() {
  return Eaters.sorted[0]
}

MakeLunch.showFeedback = function showFeedback (text) {
  window.scrollTo(0, 0)
  var feedback = $("#feedback")
  feedback.show()
  feedback.text("> ");

  (function tickerText (i) {
    setTimeout(function() {
      feedback.text(feedback.text() + text[i])
      if (i < text.length - 1) {
        tickerText(++i)
      } else {
        feedback.delay(2000).fadeOut()
      }
    }, 50)
  })(0)
}

Template.home.todaysDate = function () {
  return todaysDate()
}

Template.card.events({
  'dblclick .card': function(evt, tpl){
    var newStatus = (this.status !== 'rye') ? 'rye' : 'jail'
    Eaters.update(this._id, { $set: {status: newStatus}})
  }
})

Template.header.events({
  'click .menu-toggle': function (evt, tpl) {
    $('#header').toggleClass('active')
  },
  'click #header nav a': function (evt, tpl) {
    $('#header').removeClass('active')
  },
  'click .login-with-twitter': function (evt, tpl) {
    evt.preventDefault()
    Meteor.loginWithTwitter()
  }
})
