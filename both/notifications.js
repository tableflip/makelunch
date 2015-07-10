Meteor.startup(function() {
  if (!Meteor.settings.public) return
  Meteor.notificationClient = new NotificationClient({
    senderId: Meteor.settings.public.GCM.senderId,
    gcmAuthorization: Meteor.settings.GCM && Meteor.settings.GCM.authorization
  })
})