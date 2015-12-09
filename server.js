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
 * GET /api/gifs/search
 * assigns random search tag to email caches result
 */
app.get('/api/gifs/search', function(req, res, next) {
  var emailLookup = new RegExp(req.query.email);
  if (!validateEmail(emailLookup)){
    return res.status(404).send("Please enter a valid email address");
  }
  // error handlers
  // use try block
  redis.exists(emailLookup, function(err, reply){
    console.log("exists")
    if (reply === 1){
      redis.lrange(emailLookup, 0, -1, function(err, reply){
        res.send({data: reply});
      })
    } else {
      console.log("doesn't exist");
      var celebs = ["jim+carrey", "ryan+gosling", "bill+murray", "olivia+wilde", "minka+kelly"];
      var celeb = celebs[Math.floor(Math.random()*celebs.length)];
      var giphyUrl = "http://api.giphy.com/v1/gifs/search?q=" + celeb + "&api_key=dc6zaTOxFJmzC&limit=5";
      request.get(giphyUrl, function(error,response, body){
        if (!error && response.statusCode == 200) {
          redis.rpush(parseGiphyData(emailLookup, body)); // stores giphy data object
          redis.expire(emailLookup, 60); // expires after one minute
          redis.lrange(emailLookup, 0, -1, function(err, reply){
            res.send({data: reply});
          })
        } else {
          res.status(404).send("Giphy failed to provide valid request");
        }
      })
    }
  })
});

var parseGiphyData = function(emailLookup,results){
  var results = JSON.parse(results);
  var res = [emailLookup];
  results["data"].forEach(function(img){
    var imgUrl = img['images']['fixed_height']['url'];
    var cloudUrl = "http://res.cloudinary.com/dts9d9zod/image/fetch/w_300,h_300,c_fill,f_auto/" + imgUrl;
    res.push(cloudUrl);
  });
  return res;
}

var validateEmail = function(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
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
 * Server
 */
var server = require('http').createServer(app);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
