var config = require('./config.json');
var Twitter = require('twitter');
var Stream = require('user-stream');
var colors = require('colors');
var low = require('lowdb');
var _ = require('lodash');
var storage = require('lowdb/file-sync');

var state = low('./state.json', {'storage': storage});
var stream = new Stream(config.api);
var client = new Twitter(config.api);

if (!state.object.tweets.length && !state.object.tweets_deleted.length) {
  state.object.tweets = require('./tweets/ALL');
  state.object.tweets = state.object.tweets.filter(function(t) {
    return t.id_str !== config.user.tweet_id_str;
  });
  state.write();
}

stream.stream();

stream.on('data', function(json) {
  if (!json.event || !json.target_object || !json.source) {
    return;
  }

  var isFav = json.event === 'favorite';
  var isTweet = json.target_object.id_str === config.user.tweet_id_str;

  if (isFav && isTweet) {
    deleteRandomTweet(json.source.screen_name);
  }
});

function deleteRandomTweet(user) {
  var alreadySubmitted = state.object.users_submitted;
  if (alreadySubmitted.indexOf(user) > -1) {
    console.log('');
    console.log(user.yellow.bold, ' TRIED TO SUBMIT AGAIN!'.red.bold);
    return;
  }

  var nextTweet = _.sample(state.object.tweets);

  client.post('statuses/destroy', {id: nextTweet.id_str}, function(err, resp) {
    if (err) {
      console.log('');
      console.log('TWEET ERRORED !!!'.bold.red);
      console.log(JSON.stringify(err, 0, 2).red);
    } else {
      state.object.users_submitted.push(user);
      state.object.tweets_deleted.push(nextTweet);
      state.object.tweets = _.without(state.object.tweets, nextTweet);
      state.write();
      console.log('');
      console.log('~~~~~~~~~~~~~~~~'.rainbow);
      console.log('');
      console.log('USER '.cyan, user.yellow.bold, ' DELETED:'.cyan);
      console.log(nextTweet.text.white);
      console.log('');
      console.log('~~~~~~~~~~~~~~~~'.rainbow);
    }
  });
}

stream.on('error', function(err) {
  console.log('');
  console.log('STREAM ERRORED !!!'.bold.red);
  console.log(JSON.stringify(err, 0, 2).red);
});
