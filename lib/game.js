/* global require,module,console */
'use strict';

var Player   = require('./player');
var Maps     = require('./maps');
var both     = require('./both');
var Response = require('./response');

function state () {
	return {
		players : {},
		map     : Maps.create(),
		phase   : 'register' // register, in progress, over
	};
}


function register (State, req, res) {
	if (State.phase !== 'register') {
		res.send(Response.invalidOp());
		return;
	}

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
	}).done(function () {
		State.phase = 'in progress';
	});
}

function move (State, req, res) {
	if (State.phase !== 'in progress') {
		res.send(Response.invalidOp());
		return;
	}

	both('move', function () {
		var player = Player.get(State, req.body.player);
		var newPos = Maps.move(player.pos, req.body.direction, State.map.size);
		var tile = Maps.get(newPos, State.map);

		player.pos      = newPos;
		player.dead     = Player.isDead(player, tile);
		player.done     = Player.isDone(player, tile);
		player.artifact = artifact(tile);
		player.log.push(Player.log(req.body.direction, player.pos));
		player.turn++;

		player._res = res;
	}).done(function () {
		resolve(State);
	});
}

/**
 * resolve the turn
 */
function resolve (State) {
	var players = Object.keys(State.players);
	var p1 = State.players[players[0]];
	var p2 = State.players[players[1]];

	if ((p1.done && p2.done) || (p1.dead && p2.dead)) {
		p1._res.send(Response.gameOver('draw'));
		p2._res.send(Response.gameOver('draw'));
		State.phase = 'over';
	} else if (p1.done || p2.dead) {
		p1._res.send(Response.gameOver('won'));
		p2._res.send(Response.gameOver('lost'));
		State.phase = 'over';
	} else if (p2.done || p1.dead) {
		p1._res.send(Response.gameOver('lost'));
		p2._res.send(Response.gameOver('won'));
		State.phase = 'over';
	} else {
		p1._res.send(Response.view(p1.pos, State.map));
		p2._res.send(Response.view(p2.pos, State.map));
	}
}

function artifact (tile) {
	return tile.artifact;
}

module.exports = {
	move     : move,
	register : register,
	state    : state
};