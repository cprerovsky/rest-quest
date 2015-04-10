/* global module,require */
'use strict';

var Maps = require('./maps');

/**
 * Obfuscates a view so that the opponent's auth credentials are withheld
 * @param {player} player the recipient of the view
 * @param {Array.<Array>} view the view to censor
 */
function censorView(player, view) {
	for(var i = 0; i < view.length; ++i) {
		var row = view[i];
		for (var j = 0; j < row.length; ++j) {
			var col = row[j];
			if (typeof col.castle !== 'undefined' && col.castle != player.name) {
				var newname = 'Your enemy';
				if (player.name == newname) {
					newname = 'Your worst enemy';
				}
				console.log("Castle spotted for " + player.name + " owned by " + col.castle + " – disguising as " + newname);
				row[j] = {
					'type': col.type,
					'castle': newname
				}
			}
		}
	}
}


/**
 * create a view response for a player on a map
 *
 * @param {Player} player
 * @param {Map} map
 * @return {string}
 */
function view (player, map) {
	var playerView = Maps.view(player.pos, map);
	censorView(player, playerView);
	return JSON.stringify({ 
		view     : playerView,
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
