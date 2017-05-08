# Make Lunch!

https://lunch.tableflip.io

Helps figure out who should cooking next by recording stats on how many servings you've made vs how many you've received.

If I cook for 8 people (including me), I recieve 1 portion and give 8, so am +7

Meals are historical records. The stats on the Eaters are calculated on meal insert. It's an experiment in document storage style.

To recommend who cooks next we look at how has the lowest value of `servings.given` - `servings.recieved`.

**TODO:**
- Support multiple groups
- In the event of a tie, who cooked longest ago. (could also factor in meals eaten vs cooked)
- Whizzbang visualizations

## Getting started

- Clone the repo
- Copy settings.tpl to settings.json and fill out the blanks
- Run meteor:
```bash
$ meteor run --settings settings.json
```
- Go to [http://localhost:3000](http://localhost:3000)

### Build it with Docker

```
# Build it
docker build -t makelunch .

# Run it
docker run -p 3000:3000 -u "node" \
-e "MONGO_URL=mongodb://<ure db here>" \
-e "ROOT_URL=http://localhost:3000" \
-e "METEOR_SETTINGS="$(cat settings.json)" makelunch
```

### Deploy it with now.sh

Put env config in .env.production
```sh
ROOT_URL="https://lunch.tableflip.io"
MONGO_URL="@makelunch-mongo-url-prod"
METEOR_SETTINGS="@makelunch-settings-prod"
```

Then On the TABLEFLIP `now` account (if you plan to deploy to lunch.tableflip.io)

Add secrets
```sh
now secret add makelunch-mongo-url-prod <db url>
now secret add makelunch-settings-prod "${cat settings.json | tr -d '\n'}"
```

Deploy!
```sh
now --dotenv=.env.production --docker
```

You can run that last command to your hearts content. Each deploy get's it's own url.

Once your happy with it, alias the deployment to the live URL
```sh
now alias https://makelunch-zyfwsdybcl.now.sh/ lunch.tableflip.io
```

You should see:

```sh
$ now alias https://makelunch-mdpmammtdx.now.sh lunch.tableflip.io
> lunch.tableflip.io is a custom domain.
> Verifying the DNS settings for lunch.tableflip.io (see https://zeit.world for help)
> Success! Domain tableflip.io (FOn9AsAAz4hzoeh1z5Fa463G) added
> Verification OK!
> Provisioning certificate for lunch.tableflip.io
> Success! lunch.tableflip.io now points to makelunch-mdpmammtdx.now.sh! [29s]
```

:rocket:

## Collections

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

## Initial data

- 2014-02-10, Hammick cooked leaky pasta for Elliot, Evans, Robinson, Wooding + 1 guest
- 2014-02-11, Wooding cooked baked potatoes for Elliot, Evans, Hammick, Shaw + 1 guest
- 2014-02-12, Shaw Bacon pasta cooked for Elliot, Hammick, Robinson, Wooding + 1 guest
- 2014-02-13, Evans cooked Onion, Bean & Pancetta Stew for Shaw, Wooding, Elliot, Hammick, Heatherington + 1 guest
- 2014-02-14, Elliot and Heatherington cooked Fish pie for Shaw, Wooding, Elliot, Hammick, Evans, Robinson
