require("dotenv").config();

var keys = require('./keys');
var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var fs = require('fs');

var client = new twitter(keys.twitter);
var spotify = new spotify(keys.spotify)


var nodeArg = process.argv;
var pick = process.argv[2];

var input = "";

for (var i = 3; i < nodeArg.length; i++) {
    if ((i > 3) && (i < nodeArg.length)) {
        input = input + "+" + nodeArg[i];
    } else {
        input = input + nodeArg[i];
    }
}

switch (pick) {
    case 'tweets':
        tweets();

        break;

    case 'spotifysong':
        if (input) {
            spoti(input);

        } else {
            spoti('Legend');

        }
        break;
    case 'movie':
        if (input) {
            movies(input);
        } else {
            movies('Chronicle');
        }
        break;
    case 'do-it':
        Liri();
        break;

    default:
        console.log("Pick a thing, yo: tweets, spotifysong, movie, do-it");
        break;
}

function spoti(song) {
    spotify.search({
        type: 'track',
        query: song
    }, 
    function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songdata = data.tracks.items[i];
                console.log("Track Name: " + songdata.name);
                console.log("Artist: " + songdata.artists[0].name);
                console.log("Album: " + songdata.album.name);
                console.log("URL: " + songdata.preview_url);
                console.log("---------------------------------");
                log("Track Name: " + songdata.name);
                log("Artist: " + songdata.artists[0].name);
                log("Album: " + songdata.album.name);
                log("URL: " + songdata.preview_url);
            }
        } else {
            console.log("Spotify messed up somewhere, just know this means there's an error, but won't tell you what error, cause then that'd be too easy.");
        }
    });
}

function tweets() {
    var username = {
        screen_name: 'SneedCE'
    };
    client.get('statuses/user_timeline', username, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@SneedCE: " + tweets[i].text + " " + "Date: " + date.substring(0, 19));
                log("@SneedCE: " + tweets[i].text + " " + "Date: " + date.substring(0, 19));
                log("----------------------------------");
            }
        } else {
            console.log('twitter messed up')
        }
    })
}

function movies(movieName) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            log("Title: " + JSON.parse(body).Title);
            log("Release Year: " + JSON.parse(body).Year);
            log("IMDB Rating: " + JSON.parse(body).imdbRating);
            log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
        } else {
            console.log("omdb sucks and messed up again");
        }
    });
}

function Liri() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        var txt = data.split(',');
        spoti(txt[1]);
    });
}

function log(logging){
    fs.appendFile('log.txt', logging, function(error){
        if(error){
            throw error;
        }
    });
}