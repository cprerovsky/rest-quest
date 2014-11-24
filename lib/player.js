/*global require,module*/
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
		name   : name,
		pos  : { x:0, y:0 },
		turn : 0,
		dead : false
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
	var tile = Maps.get(player.pos, map);
	if (tile.type === 'water' || (tile.castle && tile.castle !== player.name)) {
		return true;
	}
	return false;
}

module.exports = {
	create : create,
	get    : get,
	isDead : isDead
};