App.info({
  id: 'io.tableflip.makelunchdev',
  version: '0.3',
  name: 'MakeLunch Dev',
  description: 'Lunch tracking app',
  author: 'tableflip',
  email: 'hello@tableflip.io',
  website: 'http://makelunch.meteor.com'
})

App.accessRule('http://www.gravatar.com', {launchExternal: false})
App.accessRule('http://yui.yahooapis.com', {launchExternal: false})
App.accessRule('http://netdna.bootstrapcdn.com', {launchExternal: false})
App.accessRule('http://jailmake.com', {launchExternal: false})
App.accessRule('http://fc05.deviantart.net', {launchExternal: false})
App.accessRule('http://rusbycycles.co.uk', {launchExternal: false})
App.accessRule('http://2013.lxjs.org', {launchExternal: false})
App.accessRule('http://photos-a.ak.instagram.com', {launchExternal: false})
App.accessRule('https://pbs.twimg.com/profile_images', {launchExternal: false})
App.accessRule('https://fbcdn-sphotos-c-a.akamaihd.net', {launchExternal: false})
App.accessRule('http://i2.bebo.com', {launchExternal: false})
App.accessRule('https://cloud.githubusercontent.com', {launchExternal: false})
App.accessRule('http://photos-h.ak.instagram.com', {launchExternal: false})
App.accessRule('https://avatars0.githubusercontent.com', {launchExternal: false})
App.accessRule('http://media-cache-ec0.pinimg.com', {launchExternal: false})

App.setPreference('keepRunning', false)

App.icons({
  'iphone': 'icons/ios/appicon-60.png',
  'iphone_2x': 'icons/ios/appicon-60@2x.png',
  'iphone_3x': 'icons/ios/appicon-60@3x.png',
  'ipad': 'icons/ios/appicon-76.png',
  'ipad_2x': 'icons/ios/appicon-76@2x.png',
  'android_ldpi': 'icons/android/appicon.png',
  'android_mdpi': 'icons/android/appicon.png',
  'android_hdpi': 'icons/android/appicon.png',
  'android_xhdpi': 'icons/android/appicon.png'
})

App.launchScreens({
  'iphone': 'icons/ios/iTunesArtwork',
  'iphone_2x': 'icons/ios/iTunesArtwork',
  'iphone5': 'icons/ios/iTunesArtwork',
  'iphone6': 'icons/ios/iTunesArtwork',
  'iphone6p_portrait': 'icons/ios/iTunesArtwork',
  'iphone6p_landscape': 'icons/ios/iTunesArtwork',
  'ipad_portrait': 'icons/ios/iTunesArtwork',
  'ipad_portrait_2x': 'icons/ios/iTunesArtwork@2x',
  'ipad_landscape': 'icons/ios/iTunesArtwork',
  'ipad_landscape_2x': 'icons/ios/iTunesArtwork@2x',
  'android_ldpi_portrait': 'icons/android/images/res-en-long-port-ldpi/default.png',
  'android_ldpi_landscape': 'icons/android/images/res-en-long-land-ldpi/default.png',
  'android_mdpi_portrait': 'icons/android/images/res-en-long-port-mdpi/default.png',
  'android_mdpi_landscape': 'icons/android/images/res-en-long-land-mdpi/default.png',
  'android_hdpi_portrait': 'icons/android/images/res-en-long-port-hdpi/default.png',
  'android_hdpi_landscape': 'icons/android/images/res-en-long-land-hdpi/default.png',
  'android_xhdpi_portrait': 'icons/android/images/res-en-long-port-xhdpi/default.png',
  'android_xhdpi_landscape': 'icons/android/images/res-en-long-land-xhdpi/default.png'
})