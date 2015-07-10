Today = new Meteor.Collection('Today')

Meals = new Meteor.Collection('Meals')

Eaters = new Meteor.Collection('Eaters', { transform: function (e) {
  e.img = e.img || "http://www.gravatar.com/avatar/" + CryptoJS.MD5(e.name) + "?s=300&d=monsterid"
  return e
}})

Eaters.create = function(opts){
  if(typeof opts.name != 'string' || opts.name === '' || opts.name.match(/^\s+$/)  ) throw new Error("name not string")
  opts.status = opts.status || 'jail'
  opts.servings = opts.servings || {'given':0,'received':0}
  return Eaters.insert(opts)
}

Eaters.scoreSummary = function(eater){
  if(!eater) return null
  var score = eater.servings.given - eater.servings.received
  if (score === 0) return "perfect"
  if (score > 0) return "good"
  if (score < 0) return "bad"
}

Eaters.sorted = function(query) {
  return this.find(query || {}).fetch().sort(scoreSort)
}

function scoreSort (a, b) {
  if (score(a) === score(b)) {
    var aLastCooked = a.lastCooked || "1970-01-01"
    var bLastCooked = b.lastCooked || "1970-01-01"

    if (moment(aLastCooked).isSame(bLastCooked)) {
      return 0
    } else if (moment(aLastCooked).isBefore(bLastCooked)) {
      return -1
    } else {
      return 1
    }
  }
  if (score(a) > score(b)) return 1;
  return -1
}

function score (person){
  if(!person || !person.servings) return 0;
  return person.servings.given - person.servings.received
}

Meals.create = function(meal){
  if(!meal) throw new Error("No meal provided")
  if (meal.dish === '' || null) throw new Error("Can't create a meal with an empty dish!")
  if (meal.date === '' || null) throw new Error("Not valid date!")
  if (meal.chefs.length === 0) throw new Error("need chefs")
  if (meal.eaters.length === 0) throw new Error("need eaters") 
  return Meals.insert(meal)
}

Meals.edit = function(id, meal){
  if(!meal) throw new Error("No meal provided")

  Meals.update(id, {$set: meal})
}

// returns todays date as 2014-02-09
todaysDate = function todaysDate() {
  return new Date().toISOString().split('T')[0]
}