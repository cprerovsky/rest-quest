/*global module*/
'use strict';


/**
 * create a new player for the game
 */
function player (name, players) {
	if (!name) {
		throw 'cant register player without a name';
	}

	if (Object.keys(players).length >= 2) {
		throw 'invalid join by player {' + name + '} - disqualified';
	}

	return {
		name   : name,
		pos  : { x:0, y:0 },
		turn : 0
	};
}


module.exports = {
	player : player
};