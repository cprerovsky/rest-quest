/*global require,console*/
'use strict';

var Express = require('express.io');
var BodyParser = require('body-parser');
var Maps = require('./lib/maps');
var Game = require('./lib/game');
var both = require('./lib/both');

var App = new Express();
var State = initState();

App.use(BodyParser.urlencoded({ extended: true }));


// ----- funcs -----

function initState () {
	return {
		players : {},
		map     : Maps.create()
	};
}

function player (name) {
	if (State.players.hasOwnProperty(name)) {
		return State.players[name];
	}
	throw 'requested illegal player {' + name + '}';
}

// ----- routes -----

App.post('/register/', function (req, res) {
	var player = Game.player(req.body.name, State.players);
	State.players[player.name] = player;
	console.log('registered player ', player);
	
	both('register', function () {
		res.send('OK');
	}).once(function () { console.log('once!'); });
});

App.post('/move/', function (req, res) {
	var p = player(req.body.player);
	var newPos = Maps.move(p.pos, req.body.direction, State.map.size);
	console.log(p, newPos);
	p.pos = newPos;
	p.turn++;

	console.log('moved player {' + p.name + '} to {' + p.pos.x + ',' + p.pos.y + '} in turn {' + p.turn + '}');

	setTimeout(function () {
		res.send(JSON.stringify(Maps.view(p.pos, State.map)));
	}, 500);
});

App.listen(3000);
console.log('Server started on localhost:3000');