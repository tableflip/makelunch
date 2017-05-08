var async = require('async')

var messageBirdURI = 'https://rest.messagebird.com/',
    heirarchy,
    eaterIndex,
    lunchHash

Meteor.startup(function() {
  heirarchy = Eaters.sorted({status: 'jail'}),
  eaterIndex = 0,
  lunchHash = Random.id()
})

function sendMessage(message, eaters, link, done) {

  if (typeof eaters === 'string')
      eaters = Eaters.find({name: eaters}).fetch();
  else if (Array.isArray(eaters))
      eaters = Eaters.find({name: {$in: eaters}}).fetch();
  else if (typeof eaters === 'object')
      eaters = [eaters]
  else if (eaters instanceof Mongo.Cursor)
      eaters = eaters.fetch()
  else
      throw new Meteor.Error('bad_eaters_argument', 'Supplied eater(s) data is not one of: eater name, eater doc, cursor over eaters, array of eater names.');

  var messageCount = 0

  async.each(eaters, function(eater, cb) {

    var user = Meteor.users.findOne({'services.twitter.screenName': eater.auth && eater.auth.twitter})

    if (user && user.regid) {
      messageCount += 1
      Meteor.notificationClient.sendNotification(user, {title: 'Message from MakeLunch', message: message, link: link})
      cb()
    } else if (eater.mobile) {
      HTTP.call('POST', messageBirdURI + 'messages', {
        headers: {
          Authorization: 'AccessKey ' + Meteor.settings.MESSAGEBIRD_KEY
        },
        data: {
          recipients: eater.mobile,
          originator: 'MakeLunch',
          body: message + ' Respond here: ' + Meteor.absoluteUrl() + link
        }
      }, function(err, res) {
        if (res) messageCount += 1
        cb(err)
      })
    } else cb()

  }, function (err) {
    done(err, messageCount)
  });
}

var sendMessageInFiber = Meteor.wrapAsync(sendMessage)

function greeting() {
  return _.sample([
    'cheeky monkey',
    'big guy',
    'darlin\'',
    'my liege',
    'hero',
    'Jamie Oliver',
    'wiseguy'
  ])
}

console.log('The local dateTime is: ' + new Date().toString())

SyncedCron.add({
  name: 'Notify tomorrow\'s cook',
  schedule: function(parser) {
    return parser.text('at 19:30');
  },
  job: startNotifying
});

SyncedCron.start();

function startNotifying() {
  if (new Date().getDay() > 4) return false
  heirarchy = Eaters.sorted({status: 'jail'})
  eaterIndex = 0
  if (heirarchy[eaterIndex]) notifyEater(heirarchy[eaterIndex].name)
  else lunchHash = Random.id()
}

function notifyEater(name) {
  lunchHash = Random.id()
  console.log('You\'re up to cook tomorrow, ' + greeting() + '!', name, 'tomorrow/' + lunchHash)
  sendMessageInFiber('You\'re up to cook tomorrow, ' + greeting() + '!', name, 'tomorrow/' + lunchHash)
}

var foo = 'bar';

Meteor.methods({
  'confirmLunch': function(answer, code) {
    if (code !== lunchHash) throw new Meteor.Error('Wrong lunch code! Is this an old lunch you\'re promising to cook?')
    if (answer) {
      console.log(heirarchy[eaterIndex].name + ' is confirmed as tomorrow\'s lunch chef')
      lunchHash = Random.id()
    }
    else {
      console.log(heirarchy[eaterIndex].name + ' can\'t cook tomorrow, moving on...')
      eaterIndex += 1
      if (heirarchy[eaterIndex]) notifyEater(heirarchy[eaterIndex].name)
      else lunchHash = Random.id()
    }
  },

  'sendMessage': function(message, eaters, password, link) {
    if (password === Meteor.settings.messagePassword) return sendMessageInFiber(message, eaters, link)
    else throw new Meteor.Error('wrong password')
  },

  'startNotifying': function(password) {
    if (password === Meteor.settings.messagePassword) return startNotifying()
    else throw new Meteor.Error('wrong password')
  }
})