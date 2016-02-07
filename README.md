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
  _id: "foo",
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
