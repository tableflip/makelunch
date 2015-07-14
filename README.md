Make Lunch!
===========

What it does
------------

Help figure out whose cooking next by recording stats on how many servings you've made vs how many you've received.

If I cook for 8 people (including me), I recieve 1 portion and give 8, so am +7

Meals are historical records. The stats on the Eaters are calculated on meal insert. It's an experiment in document storage style.

To recommend who cooks next we look at how has the lowest value of `servings.given` - `servings.recieved`. 

**TODO:**
- In the event of a tie, who cooked longest ago. (could also factor in meals eaten vs cooked)
- User auth
- Edit data / correct mistakes
- Whizzbang visulisations

Getting started
---------------
- Clone the repo
- Add a settings.json:
```json
{
  "twitter": {
    "consumerKey": "",
    "secret": ""
  }
}
```
- Run meteor:
```bash
meteor
```
- Go to [http://localhost:3000](http://localhost:3000)
- **For now, you'll need to edit the following code** in server/server.js:
```js
Accounts.validateLoginAttempt(function (info) {
  if (!info.user) return false
  var screenName = info.user.services.twitter.screenName.toLowerCase()
  var eaters = Eaters.find({ 'auth.twitter': screenName }).fetch()
  if(eaters.length === 0) return false
  return true
})
```
- Comment out everything in that function except ``` return true ``` and uncomment once you've logged in and created a user with your Twitter handle. Sorry.

Routes
------

`/` = stats & recommendations
`/addmeal` = create new meal data
`/addperson` = create new people


Collections
-----------

**Meals**
```
{
  date: isoDate
  chef: [userId]
  eaters: [userId]
  guests: Integer
  dish: String
}
```

**Eaters**
```
{
  name: String,
  img: url,
  servings: {
    given: Integer,
    received: Integer
  }
  mealsCooked: Interger,
  lastCooked: isoDate,
  lastEaten: isoDate
}
```

Initial data
------------

- 2014-02-10, Hammick cooked leaky pasta for Elliot, Evans, Robinson, Wooding + 1 guest
- 2014-02-11, Wooding cooked baked potatoes for Elliot, Evans, Hammick, Shaw + 1 guest
- 2014-02-12, Shaw Bacon pasta cooked for Elliot, Hammick, Robinson, Wooding + 1 guest
- 2014-02-13, Evans cooked Onion, Bean & Pancetta Stew for Shaw, Wooding, Elliot, Hammick, Heatherington + 1 guest
- 2014-02-14, Elliot and Heatherington cooked Fish pie for Shaw, Wooding, Elliot, Hammick, Evans, Robinson
