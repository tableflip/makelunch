App.info({
  id: 'io.tableflip.makelunch',
  version: '0.6.2',
  name: 'Lunch',
  description: 'Whose turn is it to make lunch?',
  author: 'tableflip',
  email: 'hello@tableflip.io',
  website: 'https://lunch.tableflip.io'
})

App.setPreference('BackgroundColor', '0xff303030');

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
App.accessRule('https://www.ucarecdn.com', {launchExternal: false})

App.icons({
  'iphone_3x': 'assets/icons/ios/iphone.png',
  'ipad_2x': 'assets/icons/ios/iphone.png',
  'android_xhdpi': 'assets/icons/android/android.png'
})

App.launchScreens({
  'iphone': 'assets/splash-screens/ios/Default.png',
  'iphone_2x': 'assets/splash-screens/ios/Default@2x.png',
  'iphone5': 'assets/splash-screens/ios/Default-568h@2x.png',
  'iphone6': 'assets/splash-screens/ios/Default-667h@2x.png',
  'iphone6p_portrait': 'assets/splash-screens/ios/Default-Portrait-736h@3x.png',
  'iphone6p_landscape': 'assets/splash-screens/ios/Default-Landscape-736h@3x.png',
  'ipad_portrait': 'assets/splash-screens/ios/Default-Portrait.png',
  'ipad_portrait_2x': 'assets/splash-screens/ios/Default-Portrait@2x.png',
  'ipad_landscape': 'assets/splash-screens/ios/Default-Landscape.png',
  'ipad_landscape_2x': 'assets/splash-screens/ios/Default-Landscape@2x.png',
  'android_xhdpi_portrait': 'assets/splash-screens/android/drawable-xhdpi/makelunch.9.png',
  'android_xhdpi_landscape': 'assets/splash-screens/android/drawable-xhdpi/makelunch.9.png'
})
