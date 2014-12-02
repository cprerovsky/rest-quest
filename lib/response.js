/* global module,require */
'use strict';

var Maps = require('./maps');

/**
 * create a view response for a player on a map
 *
 * @param {Player} player
 * @param {Map} map
 * @return {string}
 */
function view (player, map) {
	return JSON.stringify({ 
		view     : Maps.view(player.pos, map),
		treasure : player.treasure
	});
}

/**
 * create a game over response for a result string
 *
 * @param {string} result
 * @return {string}
 */
function gameOver (result) {
	return JSON.stringify({
		game   : 'over',
		result : result
	});
}

/**
 * create an invalid operation response
 *
 * @return {string}
 */
function invalidOp () {
	return JSON.stringify({ error : 'Invalid Operation' });
}

/**
 * create an ok response
 *
 * @return {string}
 */
function ok () {
	return JSON.stringify({ ok : true });
}

module.exports = {
	ok        : ok,
	view      : view,
	gameOver  : gameOver,
	invalidOp : invalidOp
};