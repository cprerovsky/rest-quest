/*global require,module,console*/
'use strict';

var Maps = require('./maps');

/**
 * create a new player for the game
 */
function create (name) {
	if (!name) {
		throw 'cant register player without a name';
	}

	return {
		name     : name,
		pos      : { x:0, y:0 },
		turn     : 0,
		dead     : false,
		artifact : false,
		done     : false,
		log      : []
	};
}

function get (State, name) {
	if (State.players && State.players.hasOwnProperty(name)) {
		return State.players[name];
	}
	throw Error('requested illegal player {' + name + '}');
}

/**
 * check whether a player just killed himself
 */
function isDead (player, map) {
	var tile   = Maps.get(player.pos, map);
	var water  = tile.type === 'water';
	var enemyCastle = (tile.castle && tile.castle !== player.name);
	if (water || enemyCastle) {
		console.log('{' + player.name + '} died by water: ' + water + ' castle: ' + enemyCastle);
	}
	return water || enemyCastle;
}

function isDone (player, map) {
	var tile = Maps.get(player.pos, map);
	return player.artifact && tile.castle === player.name;
}

function log (dir, pos) {
	return {
		dir : dir,
		pos : { x: pos.x, y : pos.y }
	};
}

module.exports = {
	create : create,
	get    : get,
	isDead : isDead,
	isDone : isDone,
	log    : log
};