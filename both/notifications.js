Meteor.startup(function() {
  Meteor.notificationClient = new NotificationClient({
    senderId: Meteor.settings.public.GCM.senderId,
    gcmAuthorization: Meteor.settings.GCM && Meteor.settings.GCM.authorization,
    messageHandler: function(payload, foreground, coldstart) {
      if (!payload) return null
      if (payload.link) {
        navigator.notification.alert(
          payload.message,
          document.addEventListener("deviceready", function() {
            Router.go('/' + payload.link)
          }, false),
          payload.title
        );
      } else {
        if (foreground && !coldstart) {
          navigator.notification.alert(
            payload.message,
            null,
            payload.title
          );
        } else {
          window.plugin.notification.local.add(
            _.extend({}, {
              message: payload.message,
              title: payload.title,
              autoCancel: true
            })
          );
        }
      }
    }
  });
})