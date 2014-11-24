/* global require,module,console */
'use strict';

var Assert = require('./assert');
var Player = require('./player');
var Maps   = require('./maps');
var both   = require('./both');

function state () {
	return {
		players : {},
		map     : Maps.create(),
		phase   : 'register'
	};
}


function register (State, req, res) {
	Assert.registryOpen(State.players);

	var player = Player.create(req.body.name, State.players);
	State.players[player.name] = player;
	
	// maybe this won't work?
	var castlePlace = Maps.placementTile(State.map);
	castlePlace.tile.castle = player.name;
	player.pos = {
		x: castlePlace.x,
		y: castlePlace.y
	};

	console.log('registered player {' + player.name + '} at {' + player.pos.x + ',' + player.pos.y + '}');
	
	both('register', function () {
		res.send('OK');
	}).once(function () {
		State.phase = 'in progress';
	});
}

function move (State, req, res) {
	Assert.registryClosed(State.players);

	var player = Player.get(State, req.body.player);
	var newPos = Maps.move(player.pos, req.body.direction, State.map.size);
	
	player.pos  = newPos;
	player.dead = Player.isDead(player, State.map);
	player.turn++;

	console.log('moved player {' + player.name + '} to {' + player.pos.x + ',' + player.pos.y + '} in turn {' + player.turn + '}');

	setTimeout(function () {
		res.send(JSON.stringify(Maps.view(player.pos, State.map)));
	}, 500);	
}

module.exports = {
	move     : move,
	register : register,
	state    : state
};