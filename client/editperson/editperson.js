Template.editperson.events = {
  'submit': function (evt, tpl) {
    var ctx = this
    evt.preventDefault()

    var twitterHandle = tpl.find('.twitterHandle').value
    twitterHandle = twitterHandle.trim().toLowerCase().replace('@' , '')

    var eaterId = ctx._id

    var person = {
      mobile: tpl.find('.mobile').value,
      auth: {
        twitter: twitterHandle,
        email: null
      }
    }
    if (tpl.find('.personName').value) person.name = tpl.find('.personName').value
    if (tpl.find('#uploadcare-uuid').value) {
      var currentUuid = Eaters.findOne({ _id: ctx._id }).uploadcare
      Meteor.call('storeUploadcare', currentUuid, function () {
        person.uploadcare = tpl.find('#uploadcare-uuid').value
        Meteor.call('storeUploadcare', person.uploadcare, function () {
          Eaters.update(eaterId, {$set: person})
          Router.go('/')
        })
      })
    } else {
      Eaters.update(eaterId, {$set: person})
      Router.go('/')
    }
  }
}

Template.editperson.onRendered(function () {
  var widget = uploadcare.Widget('[role=uploadcare-uploader]')
  widget.onUploadComplete(function (fileInfo) {
    console.log('Got Uploadcare UUID:', fileInfo.uuid)
    $('input#uploadcare-uuid').val(fileInfo.uuid)
  })
})
