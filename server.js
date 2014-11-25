/*global require,console*/
'use strict';

var Express    = require('express.io');
var BodyParser = require('body-parser');
var Game       = require('./lib/game');
var both       = require('./lib/both');

var State = Game.state();
var App = new Express();

App.use(BodyParser.urlencoded({ extended: true }));

// ----- routes -----

App.post('/register/', function (req, res) { Game.register(State, req, res); });
App.post('/move/',     function (req, res) { Game.move(State, req, res); });
App.get('/reset/',     function (req, res) { State = Game.state(); both.clear(); res.send('reset ok'); console.log('reset')});

App.listen(3000);
console.log('Server started on localhost:3000');