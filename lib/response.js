/* global module,require */
'use strict';

var Maps = require('./maps');

function view (pos, map, player) {
	return JSON.stringify({ 
		view     : Maps.view(pos, map),
		treasure : player.treasure
	});
}

function gameOver (result) {
	return JSON.stringify({
		game   : 'over',
		result : result
	});
}

function invalidOp () {
	return JSON.stringify({ error : 'Invalid Operation' });
}

module.exports = {
	view      : view,
	gameOver  : gameOver,
	invalidOp : invalidOp
};