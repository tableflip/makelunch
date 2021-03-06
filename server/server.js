Meteor.publish('eaters', function (opts = {}) {
  var query = {}
  if (opts._id) query._id = opts._id
  return Eaters.find(query, { sort: {name: 1} })
})

Meteor.publish('meals', function (opts = {}) {
  var limit = opts.limit || 20
  var query = {}
  if (opts.chef) query.chef = opts.chef
  if (opts._id) query._id = opts._id
  return Meals.find(query, {sort:[['date', 'desc']], limit: limit})
})

Meteor.startup(function () {

  //TODO: prevent editing from anonymous users
  Eaters.allow({
    insert: function (userId, doc) {
      if(!userId) return false
      if(!doc.servings){
        doc.servings = { given:0, received: 0 }
        doc.mealsCooked = 0
      }
      return true
    },
    update: function (userId, doc) {
      if(!userId) return false
      return true
    }
    // TODO: no deleting, just add a flag to hide if needed.
    // userIds are used like foreign keys in Meal documents
  })

  Meals.allow({
    insert:function (userId, doc) {
      if(!userId) return false
      updateStats(doc)
      return true
    },
    update: function (userId, doc) {
      if(!userId) return false
      return true;
    },
    remove: function (userId, doc) {
      if(!userId) return false
      return true;
    }
  })

  // reset stats after change
  Meals.find({}).observeChanges({
    changed: function (id, fields) {
      resetStats()
    }
  })

  if (Meteor.settings && Meteor.settings.twitter) {
    ServiceConfiguration.configurations.update(
      { "service": "twitter" },
      {
        $set: {
          "consumerKey": Meteor.settings.twitter.consumerKey,
          "secret": Meteor.settings.twitter.secret
        }
      },
      { upsert: true }
    )
  }
})

function updateStats (meal) {
  updateChefs(meal)
  updateEaters(meal)
}

// Update stats for the chef
function updateChefs (meal) {
  Eaters.update(
    {'_id': { $in: meal.chef } },
    {
      $inc: {
        'mealsCooked': 1,
        'servings.given': meal.eaters.length
      },
      $set: { lastCooked: meal.date }
    },
    { multi: true }
  )
}

// Update stats for eaters
function updateEaters (meal) {
  Eaters.update(
    { '_id': { $in: meal.eaters } },
    {
      $set: { lastEaten: meal.date },
      $inc: { 'servings.received': 1 }
    },
    { multi: true }
  )
}

// Zero out all the stats and recalculate
function resetStats () {
  Eaters.update(
    { }, // all
    {
      $unset: {
        lastEaten: "",
        lastCooked: ""
      },
      $set: {
        mealsCooked: 0,
        'servings.given': 0,
        'servings.received': 0,
      }
    },
    { multi: true }
  )

  Meals.find().fetch().forEach(updateStats)
}

Meteor.methods({
  resetStats: function () {
    resetStats()
  },
  goToJail: function () {
    Eaters.update({}, {$set: {status: 'jail'}}, {multi:true})
  },
  storeUploadcare: function (uuid, cb) {
    var ctx = this
    if (!ctx.userId) throw new Meteor.Error('403')
    var headers = {
      Authorization: 'Uploadcare.Simple ' + Meteor.settings.public.uploadcare.publicKey + ':' + Meteor.settings.uploadcare.privateKey
    }
    HTTP.put('https://api.uploadcare.com/files/' + uuid + '/storage/', {
      headers: headers
    }, cb)
  },
  removeUploadcare: function (uuid, cb) {
    var ctx = this
    if (!ctx.userId) throw new Meteor.Error('403')
    var headers = {
      Authorization: 'Uploadcare.Simple ' + Meteor.settings.public.uploadcare.publicKey + ':' + Meteor.settings.uploadcare.privateKey
    }
    HTTP.del('https://api.uploadcare.com/files/' + uuid + '/storage/', {
      headers: headers
    }, cb)
  }
})

Accounts.validateLoginAttempt(function (info) {
  if (!info.user || !info.user.services || !info.user.services.twitter) {
    console.error('Attempt to log in has no twitter credentials attached.')
    return false
  }
  if (!Eaters.find().count()) {
    Eaters.create({
      name: info.user.profile.name,
      auth: {
        twitter: info.user.services.twitter.screenName
      }
    })
    return true
  }
  if (Meteor.settings && Meteor.settings.twitterWhitelist && Meteor.settings.twitterWhitelist.indexOf(info.user.services.twitter.screenName) > -1) return true
  var screenName = info.user.services.twitter.screenName.toLowerCase()
  var eaters = Eaters.find({ 'auth.twitter': screenName }).fetch()
  if (eaters.length === 0) {
    console.error('The user ' + screenName + ' has not been registered as an eater. A registered user must add an eater with their twitter handle before they can log in.')
    return false
  }
  return true
})
