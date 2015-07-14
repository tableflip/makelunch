Meteor.startup(function() {
  document.addEventListener('pause', Meteor.connection.disconnect.bind(Meteor.connection))
  document.addEventListener('resume', Meteor.connection.reconnect.bind(Meteor.connection))
})