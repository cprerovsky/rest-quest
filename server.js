/*global require,console*/
'use strict';

var Express    = require('express.io');
var BodyParser = require('body-parser');
var Maps       = require('./lib/maps');
var Game       = require('./lib/game');

var State = Game.state();
var App = new Express();

App.use(BodyParser.urlencoded({ extended: true }));

// ----- routes -----

App.post('/register/', function (req, res) { Game.register(State, req, res); });
App.post('/move/',     function (req, res) { Game.move(State, req, res); });

App.listen(3000);
console.log('Server started on localhost:3000');