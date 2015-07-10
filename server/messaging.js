var messageBirdURI = 'https://rest.messagebird.com/',
    Future = Npm.require('fibers/future'),
    async = Meteor.npmRequire('async'),
    heirarchy,
    eaterIndex,
    lunchHash

function sendMessage(message, eaters) {

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

  var fut = new Future(),
      messageCount = 0

  async.each(eaters, function(eater, cb) {
    
    var user = Meteor.users.findOne({'services.twitter.screenName': eater.auth && eater.auth.twitter})

    if (user && user.regid) {
      messageCount += 1
      Meteor.notificationClient.sendNotification(user, {title: 'Message from MakeLunch', message: message})
      cb()
    } else if (eater.mobile) {
      HTTP.call('POST', messageBirdURI + 'messages', {
        headers: {
          Authorization: 'AccessKey ' + Meteor.settings.MESSAGEBIRD_KEY
        },
        data: {
          recipients: eater.mobile,
          originator: 'MakeLunch',
          body: message
        }
      }, function(err, res) {
        if (res) messageCount += 1
        cb(err)
      })
    } else cb()
    
  }, function(err) {
    if (err) throw err
    else fut.return(messageCount)
  });
  
  return fut.wait()
    
}

Meteor.methods({
  
  sendMessage: function(message, eaters, password) {
    if (password === Meteor.settings.messagePassword) return sendMessage(message, eaters)
    else throw new Meteor.Error('wrong password')
  }
  
})

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
  job: function() {
    heirarchy = Eaters.sorted({status: 'jail'})
    eaterIndex = 0
    if (heirarchy[eaterIndex]) notifyEater(heirarchy[eaterIndex].name)
  }
});

SyncedCron.start();

function notifyEater(name) {
  lunchHash = Random.id()
  sendMessage('You\'re up to cook tomorrow, ' + greeting() + '! Respond here: http://makelunch.meteor.com/tomorrow/' + lunchHash, name);
}

Meteor.methods({
  'confirmLunch': function(answer, hash) {
    if (hash !== lunchHash) throw new Meteor.Error('Wrong lunch hash! Is this an old lunch you\'re promising to cook?')
    if (answer) console.log(heirarchy[eaterIndex].name + ' is confirmed as tomorrow\'s lunch chef')
    else {
      console.log(heirarchy[eaterIndex].name + ' can\'t cook tomorrow, moving on...')
      eaterIndex += 1
      if (heirarchy[eaterIndex]) notifyEater(heirarchy[eaterIndex].name)
    }
  }
})