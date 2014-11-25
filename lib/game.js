/* global require,module,console */
'use strict';

var Player = require('./player');
var Maps   = require('./maps');
var both   = require('./both');

function state () {
	return {
		players : {},
		map     : Maps.create(),
		phase   : 'register' // register, in progress, over
	};
}


function register (State, req, res) {
	if (State.phase !== 'register') {
		resInvalidOp(res);
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
	}).once(function () {
		State.phase = 'in progress';
	});
}

function move (State, req, res) {
	if (State.phase !== 'in progress') {
		resInvalidOp(res);
		return;
	}

	both('move', function () {
		var player = Player.get(State, req.body.player);
		var newPos = Maps.move(player.pos, req.body.direction, State.map.size);

		player.pos  = newPos;
		player.dead = Player.isDead(player, State.map);
		player.done = Player.isDone(player, State.map);
		player.log.push(Player.log(req.body.direction, player.pos));
		player.turn++;

		player._res = res;
	}).once(function () {
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
		p1._res.send(respond('draw'));
		p2._res.send(respond('draw'));
		State.phase = 'over';
	} else if (p1.done || p2.dead) {
		p1._res.send(respond('won'));
		p2._res.send(respond('lost'));
		State.phase = 'over';
	} else if (p2.done || p1.dead) {
		p1._res.send(respond('lost'));
		p2._res.send(respond('won'));
		State.phase = 'over';
	} else {
		p1._res.send(JSON.stringify(Maps.view(p1.pos, State.map)));
		p2._res.send(JSON.stringify(Maps.view(p2.pos, State.map)));
	}
}

function respond (result) {
	return JSON.stringify({
		game   : 'over',
		result : result
	});
}

function resInvalidOp (res) {
	res.send(JSON.stringify({ error : 'Invalid Operation' }));
}

module.exports = {
	move     : move,
	register : register,
	state    : state
};