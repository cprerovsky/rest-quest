/*global module*/
'use strict';


/**
 * create a new player for the game
 */
function create (name, players) {
	if (!name) {
		throw 'cant register player without a name';
	}

	return {
		name   : name,
		pos  : { x:0, y:0 },
		turn : 0
	};
}

function get (State, name) {
	if (State.players.hasOwnProperty(name)) {
		return State.players[name];
	}
	throw 'requested illegal player {' + name + '}';
}

module.exports = {
	create : create,
	get : get
};