Template.tomorrow.onCreated(function() {
  this.errorMessage = new ReactiveVar()
})

Template.tomorrow.helpers({
  errorMessage: function() {
    return Template.instance().errorMessage.get()
  }
})

Template.tomorrow.events({
  'click [data-action="confirm-lunch"]': function(evt, tmp) {
    tmp.errorMessage.set(null)
    Meteor.call('confirmLunch', $(evt.currentTarget).data('response'), Router.current().params.code, function(err, res) {
      if (err) {
        console.log(err)
        tmp.errorMessage.set(err.error)
      }
      else Router.go('home')
    });
  }
})