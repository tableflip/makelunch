Template.editperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var twitterHandle = tpl.find('.twitterHandle').value
    twitterHandle = twitterHandle.trim().toLowerCase().replace('@' , '')

   var eaterId = this._id

    var person = {
      auth: {
        twitter: twitterHandle,
        email: null
      }
    }
    if (tpl.find('.personName').value) person.name = tpl.find('.personName').value
    if (tpl.find('#uploadcare-uuid').value) person.uploadcare = tpl.find('#uploadcare-uuid').value
    if (tpl.find('.mobile').value) person.mobile = tpl.find('.mobile').value

    Eaters.update(eaterId, {$set: person})
    Router.go('/')
  }
}

Template.editperson.onRendered(function () {
  var widget = uploadcare.Widget('[role=uploadcare-uploader]')
  widget.onUploadComplete(function (fileInfo) {
    console.log('Got Uploadcare UUID:', fileInfo.uuid)
    $('input#uploadcare-uuid').val(fileInfo.uuid)
  })
})
