/*global require,module,console*/
'use strict';

/**
 * create a new player for the game
 */
function create (name) {
	if (!name) {
		throw Error('cant register player without a name');
	}

	return {
		name     : name,
		pos      : { x:0, y:0 },
		turn     : 0,
		dead     : false,
		treasure : false,
		done     : false,
		log      : [],
		climb    : false
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
function isDead (player, tile) {
	var water  = tile.type === 'water';
	var enemyCastle = (tile.castle && tile.castle !== player.name);
	if (water || enemyCastle) {
		console.log('{' + player.name + '} died by water: ' + water + ' castle: ' + enemyCastle);
	}
	return water || enemyCastle;
}

function isDone (player, tile) {
	return player.treasure && tile.castle === player.name;
}

module.exports = {
	create : create,
	get    : get,
	isDead : isDead,
	isDone : isDone
};