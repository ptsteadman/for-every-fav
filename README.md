# for-every-fav

An app that uses [Twitter user streams](https://dev.twitter.com/streaming/userstreams) to listen to favorites on a specific tweet, and then trigger an action.
Currently it is deleting one of [my](http://twitter.com/artnotfound) tweets randomly.

## Usage

If you want to use it yourself, set up a `config.json` that looks like:

```js
{
  "user": {
    "name": "your_username", // eg "SHAQ"
    "id": your_userid, // eg 17461978
    "tweet_id_str": "id_str_of_tweet_to_track" //eg "713479668221906944"
  },
  "api": {
    "consumer_key": "XXXX",
    "consumer_secret": "XXX",
    "access_token_key": "XXX",
    "access_token_secret": "XXX"
  }
}

```

and an `ALL.json` file with all your tweets in the format:

```js
[
  {
    "id_str": "6723587233",
    "text": "If u feel alone and by yourself, look in the mirror, and wow, there's two of you.  Be who you are. Who are you. I am me. Ugly, lol.   Shaq"
  },
  {
    "id_str": "3576781019",
    "text": "went to the la zoo today, a chimpanzee spit at me, dam i must be ugly, lol"
  }
]
```

then run `node app`
