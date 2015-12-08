// Babel ES6/JSX Compiler
require('babel-core/register');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Character = require('./models/character');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');
var config = require('./config');

// Redis
if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]);
} else {
    var redis = require("redis").createClient();
}
// Connect to Redis server
redis.on('connect', function() {
    console.log('connected to Redis');
});
// error handlers
redis.on('error', function (err) {
  console.log('Error ' + err);
});

// dictionary of giphy terms
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dts9d9zod',
  api_key: '396815741769687',
  api_secret: 'XLhlmK8czr5U81H-zgF_yQLbldg'
});

var app = express();
//
// mongoose.connect(config.database);
// mongoose.connection.on('error', function() {
//   console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
// });

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * GET /api/characters
 * Returns 2 random characters of the same gender that have not been voted yet.
 */
app.get('/api/gifs', function(req, res, next) {
  var choices = ['Female', 'Male'];
  var randomGender = _.sample(choices);

  console.log("Server here");
  console.log(req);
});

/**
 * GET /api/gifs/search
 * Looks up a character by name. (case-insensitive)
 */
app.get('/api/gifs/search', function(req, res, next) {
  var emailLookup = new RegExp(req.query.email);

  redis.exists(emailLookup, function(err, reply){
    if (reply === 1){
      console.log("does exist");
      redis.get(emailLookup, function(err, reply) {
          console.log(reply);
      });
    } else {
      // var giphyUrl = "http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=dc6zaTOxFJmzC&limit=5";
      console.log("doesn't exist");
      console.log(emailLookup);
      var celebs = ["jim+carrey", "ryan+gosling", "bill+murray", "olivia+wilde", "minka+kelly"]
      var celeb = celebs[Math.floor(Math.random()*celebs.length)];
      var giphyUrl = "http://api.giphy.com/v1/gifs/search?q=" + celeb + "&api_key=dc6zaTOxFJmzC&limit=5";
      giphyCall(giphyUrl, function(results){
        // if hash map empty
        console.log(results);
        parseGiphyResult(results);
        redis.set(emailLookup, results); // stores giphy data object
        redis.expire(emailLookup, 60); // expires after one minute
      });
    }
  })

  // assign random term
  //find in redis cache first
  // if not in redis cache then make request to giphy api
  // save results in redis and return callback
});

var giphyCall = function(url, callback){
  request.get(url,function(error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    } else {
      callback(error);
    }
  });
}

var parseGiphyResult = function(results){
  var results = JSON.parse(results);
  results["data"].forEach(function(img){
    var imgUrl = img['images']['fixed_height']['url'];
    var cloudUrl = cloudinary.image(imgUrl, {height: 300, type: "fetch", fetch_format: "auto"})
    console.log(cloudUrl);
  })
}



// use image fetch


app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

/**
 * Socket.io stuff.
 */
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
