MakeLunch = {} // our global for helpers

Meteor.startup(function () {

  Router.configure({
    layoutTemplate: 'layout'
  })

  Router.onBeforeAction(function () {
    $('body, html').scrollTop(0)
    this.next()
  })

  Router.map(function () {

    this.route('home', {
      path:'/' ,
      onBeforeAction: [
        function () {
          this.subscribe('eaters')
          this.next()
        }
      ],
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
      onBeforeAction: [
        function () {
          this.subscribe('eaters')
          this.next()
        }
      ],
      data: function () {
        return {
          chef: this.params.query.chef,
          people: Eaters.find({status:'jail'}),
        }
      }
    })

    this.route('editmeal', {
      path:'/editmeal/:_id',
      onBeforeAction: [
        function () {
          this.subscribe('meals', {_id: this.params._id})
          this.subscribe('eaters')
          this.next()
        }
      ],
      data: function () {
        var meal = Meals.findOne(this.params._id)
        if (!meal) return {
          meal: null,
          eaters: null,
          chefs: null,
          people: null
        }
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
      onBeforeAction: [
        function () {
          this.subscribe('eaters', {_id: this.params._id})
          this.next()
        }
      ],
      data: function() {
        return Eaters.findOne(this.params._id)
      }
    })

    this.route('addperson')

    this.route('eater', {
      path: '/eater/:_id',
      onBeforeAction: [
        function () {
          this.subscribe('eaters')
          this.subscribe('meals', { chef: this.params._id })
          this.next()
        }
      ],
      data: function () {
        var ctx = this
        return {
          eater: Eaters.findOne(this.params._id),
          meals: Meals.find({ chef: this.params._id })
        }
      }
    })

    this.route('meals', {
      path:'/meals',
      onBeforeAction: [
        function () {
          this.subscribe('eaters')
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
      path:'/tomorrow/:code',
      onBeforeAction: function () {
        if (!Meteor.userId()) Router.go('home')
        this.next()
      }
    })
  })// end router.map

  //registerHelpers
  Template.registerHelper('scoreSummary', Eaters.scoreSummary)
})// end Meteor.startup

Accounts.onLoginFailure(function () {
  console.error('Could not log in! Are you sure there is a registered Eater with this twitter handle?  If not, you\'ll need to get an already registered Eater to add one.')
})

Template.registerHelper('fromNow', function (date) {
  return moment(date + 'T12:00').fromNow()
})

Template.registerHelper('equal', function (a, b) {
  return a === b
})

Template.registerHelper('profile', function (userId) {
  var eater = Eaters.findOne(userId)
  eater.monster = eater.monster || "https://www.gravatar.com/avatar/" + CryptoJS.MD5(eater.name) + "?s=300&d=monsterid"
  return eater
})

Template.registerHelper('monster', function () {
  if (!this || !this.name) return "https://www.gravatar.com/avatar/mario?s=768&d=retro"
  return "https://www.gravatar.com/avatar/" + CryptoJS.MD5(this.name) + "?s=768&d=retro"
})

Template.registerHelper('photo', function () {
  if (!this || !this.name) return "https://www.gravatar.com/avatar/mario?s=768&d=retro"
  if (!this.uploadcare) return "https://www.gravatar.com/avatar/" + CryptoJS.MD5(this.name) + "?s=768&d=retro"
  return "https://www.ucarecdn.com/"+this.uploadcare+"/-/scale_crop/768x768/center"
})

Template.registerHelper('score', function (eater) {
  return eater.servings.given - eater.servings.received
})

Template.registerHelper('status', function (eater) {
  if (eater.servings.given > eater.servings.received) return 'positive'
  if (eater.servings.given < eater.servings.received) return 'negative'
  if (eater.servings.given === eater.servings.received) return 'balanced'
})

Template.registerHelper('absPointsArray', function (eater) {
  var absPoints = Math.abs(eater.servings.given - eater.servings.received)
  return Array.apply(null, Array(absPoints)).map(function () {})
})

function whoShouldCook() {
  return Eaters.sorted[0]
}

Template.registerHelper('todaysDate', function () {
  return todaysDate()
})

Template.registerHelper('todaysISODate', function () {
  return moment().format('YYYY-MM-DD')
})

Template.registerHelper('niceDate', function (date) {
  return moment(date, 'YYYY-MM-DD').format('ddd Do MMM')
})

Template.registerHelper('niceDateWithYear', function (date) {
  return moment(date, 'YYYY-MM-DD').format('ddd Do MMM YYYY')
})

Template.card.events({
  'click .photoFrame': function (evt, tpl) {
    $('.card').removeClass('visible')
    tpl.$('.card').addClass('visible')
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

Template.registerHelper('uploadcarePublicKey', function () {
  return Meteor.settings.public.uploadcare.publicKey
})
