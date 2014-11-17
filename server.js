/*global require,console*/
'use strict';

var Express = require('express.io');
var Maps = require('lib/map');
var Game = require('lib/game');


var App = new Express();
var State = initState();


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
	throw 'requested illegal player ' + name;
}

// ----- routes -----

App.post('/register/', function (req, res) {
	var player = {
		name   : req.params.name,
		pos  : initPos(),
		turn : 0
	};

	State.players[player] = player;
	res.send(JSON.stringify({ok : true}));
});

App.post('/move/', function (req, res) {	
	Game.move(player(req.params.player), req.params.direction, State.map.size);

	setTimeout(function () {
		res.send(JSON.stringify({ 'ok' : true }));
	}, 2000);
});



App.listen(3000);
console.log('Server started on localhost:3000');