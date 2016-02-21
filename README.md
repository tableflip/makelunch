Make Lunch!
===========

Help figure out whose cooking next by recording stats on how many servings you've made vs how many you've received.

If I cook for 8 people (including me), I recieve 1 portion and give 8, so am +7

Meals are historical records. The stats on the Eaters are calculated on meal insert. It's an experiment in document storage style.

To recommend who cooks next we look at who has the lowest value of `servings.given` - `servings.recieved`.

## Documents

**Groups**

```js
{
  id: "foo",
  name: "JAILmake",
  slug: "jailmake",
  photo: "https://logo.png",
  meals: {
    count: Number
    last: _id
  }
  people: [
    {
      id: "x",
      name: "Bob",
      photo: "https://foobar.com/me.jpg",
      score: Number,
      cookedAt: Date,
      suspendAt: Date,
      deletedAt: Date
    }
  ]
}
```

**Meals**

```js
{
  _id: id,
  group: groupId
  date: isoDate
  chef: [userId]
  eaters: [userId]
  guests: Integer
  dish: String
}
```

**Users**
```js
profile: {
  groups: [
    {
      _id: "foo",
      name: "JAILmake",
      slug: "jailmake",
      photo: "logo.png",
      stats: {
        servings: {
          given: Number,
          received: Number
        },
        meals: {
          cooked: [mealId]
          attended: [mealId]
        }
      }
    }
  ]
}
```

## Modes of app usage

**Determined soloist**

1. Unknown user logs in via twitter: _Create user_
2. User starts new group: _Create group_, _Create member_
3. User adds members: _Create member_
4. User logs meal: _Create meal_

**Crowdsource**

1. Start a new group: _Create group_
2. Add yourself: _Create user_
2. Add emails for others: _Invite user_


Create account... get jwt.

do you have a jwt?
  return user info with response



