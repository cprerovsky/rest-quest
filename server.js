/*global require,console*/
'use strict';

var Express = require('express.io');
var BodyParser = require('body-parser');
var Maps = require('./lib/maps');

var App = new Express();
var State = initState();

App.use(BodyParser.urlencoded({ extended: true }));


// ----- funcs -----

function initPos () {
	return { x: 0, y: 0 };
}

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
	if (!req.body.name) {
		throw 'cant register player without a name';
	}

	if (Object.keys(State.players).length >= 2) {
		throw 'invalid join by player {' + player.name + '} - disqualified';
	}

	var newPlayer = {
		name   : req.body.name,
		pos  : initPos(),
		turn : 0
	};

	State.players[newPlayer.name] = newPlayer;
	console.log('registered player ', newPlayer);
	res.send('OK');
});

App.post('/move/', function (req, res) {
	var p = player(req.body.player);
	var newPos = Maps.move(p.pos, req.body.direction, State.map.size);
	console.log(p, newPos);
	p.pos = newPos;
	p.turn++;

	console.log('moved player {' + p.name + '} to {' + p.pos.x + ',' + p.pos.y + '} in turn {' + p.turn + '}');

	setTimeout(function () {
		res.send('OK');
	}, 1000);
});

App.listen(3000);
console.log('Server started on localhost:3000');