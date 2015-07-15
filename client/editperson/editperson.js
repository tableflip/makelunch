Template.editperson.events = {
  'submit': function (evt, tpl) {
    evt.preventDefault();

    var twitterHandle = tpl.find('.twitterHandle').value
    twitterHandle = twitterHandle.trim().toLowerCase().replace('@' , '')

   var eaterId = this._id
   var person = {
      name: tpl.find('.personName').value,
      uploadcare: tpl.find('#uploadcare-uuid').value,
      mobile: tpl.find('.mobile').value,
      auth: {
        twitter: twitterHandle,
        email: null
      }
    }

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
