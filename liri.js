
// node modules
require('dotenv').config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require('moment');
moment().format();

var fs = require("fs");


// node command line - api information
var command = process.argv[2];
var newSearch = process.argv.slice(3);
var userSearch = newSearch.join("+");
var bitUrl = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp";
var omdbUrl = "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";



// spotify 
function spotifySearch() {

    var keys = require("./keys.js");
    var spotify = new Spotify(keys.spotify);

    var searchSong = newSearch;
    if (newSearch.length < 1) {
        searchSong = "The Sign Ace of Base";
    }
    spotify.search({ type: 'track', query: searchSong }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("\n   " + data.tracks.items[0].artists[0].name + " - < " + data.tracks.items[0].name + " >");
        console.log("\n  ------------------------------------------------------------------------------  ");
        console.log("   ♪ Artist: " + data.tracks.items[0].artists[0].name);
        console.log("   ♪ Album : " + data.tracks.items[0].album.name);
        console.log("   ♪ Preview : " + data.tracks.items[0].album.external_urls.spotify);
        console.log("    ------------------------------------------------------------------------------ ");
    });
}

// bands in town search
function bitSearch() {
    axios.get(bitUrl).then(
        function (response) {
            console.log("\n  " + response.data[0].lineup);
            console.log("\n  <<<<<<<<<<<<<<<<<<<<<< event details >>>>>>>>>>>>>>>>>>>>>>>> ");
            console.log("     Venue: " + response.data[0].venue.name);
            console.log("     Location : " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log("     Event Date: " + moment(response.data[0].datetime).format('L') + " (MM/DD/YYYY)");
            console.log("    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
        }
    );
}
// omdb movie search
function omdbSearch() {
    axios.get(omdbUrl).then(
        function (response) {
            console.log("\n  " + response.data.Title + "  (" + response.data.Year + ")");
            console.log("\n  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ MOVIE ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ");
            console.log("   *  IMDB Rating: " + response.data.imdbRating);
            console.log("   *  Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("   *  Country: " + response.data.Country);
            console.log("   *  Language: " + response.data.Language);
            console.log("   *  Actors: " + response.data.Actors);
            console.log("   *  Plot: " + response.data.Plot);
            console.log("    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ");
        }
    );
}

// search functions 
if (command === "spotify-this-song") {
    spotifySearch();
}
else if (command === "concert-this") {
    bitSearch();
}
else if (command === "movie-this" && newSearch.length > 0) {
    omdbSearch();
}
else if (command === "movie-this" && !newSearch.length > 0) {
    omdbUrl = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy"
    omdbSearch();
}
else if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) { return console.log(error); }
        console.log(data);
        var dataArr = data.split('"');
        command = dataArr[0];
        newSearch = dataArr[1];
        spotifySearch();
    });
}

// search log text file
var searchTxt = newSearch;
if (newSearch.length < 1) {
    searchTxt = "None"
}
var addText = command + '"  Search: "' + searchTxt + '"  (' + moment().format('lll') + ')' + '\r\n';
fs.appendFile("log.txt", addText, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('" search log updated .. "');
    }
});