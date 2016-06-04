var tw = require('twit');
var giphy = require('giphy-api')( "dc6zaTOxFJmzC");
var http = require('http');
var server = http.createServer();
var username = '@estgfbot';
var config = require("./config.js");
var base64 = require('node-base64-image');

var t = new tw({
	consumer_key: config.consumer_key,
	consumer_secret: config.consumer_secret,
	access_token: config.access_token,
	access_token_secret: config.access_token_secret
});

var stream = t.stream('statuses/filter', { track: [username] });

stream.on('tweet', function(tweet){
	console.log(tweet);
	generateGif(tweet);
});

function generateGif(tweet){
	var id = tweet.id;
	var text = tweet.text;
	var screen_name = tweet.user.screen_name;
	var query = text.substring(text.indexOf(username));
	giphy.search(query, function(err, res){
		var image = res.data[0].images.fixed_height.url;
		if( image != undefined){
			var options = {string: true};

			base64.encode(image,options, function(err,image){

				t.post('media/upload', { media_data: image }, function (err, data, response) {
					

				  // now we can reference the media and post a tweet (media will attach to the tweet)
				  var mediaIdStr = data.media_id_string
				  var params = { status: "@" + tweet.user.screen_name + ". Have fun (*^▽^*)", in_reply_to_status_id: tweet.id_str, media_ids: [mediaIdStr] }

				  t.post('statuses/update', params, function (err, data, response) {	
				  	console.log("SENT to " + tweet.user.screen_name);
				  })
				})
			})
		}
	});
};

