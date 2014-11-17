/*global require,console*/
'use strict';

var Express = require('express.io');
var Maps = require('lib/map');


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
	var p = player(req.params.player);
	p.pos = Maps.move(p.pos, req.params.direction, State.map.size);
	p.turn++;

	console.log('moved player {' +
		p.name +
		'} to {' +
		p.pos.x + ',' + p.pos.y +
		'} in turn {' +
		p.turn +
		'}');

	setTimeout(function () {
		res.send(JSON.stringify({ 'ok' : true }));
	}, 2000);
});



App.listen(3000);
console.log('Server started on localhost:3000');