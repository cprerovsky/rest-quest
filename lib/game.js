/*global require,console*/
'use strict';

var directories = {
	up : function (player, mapSize) {
		player.pos.y += player.pos.y === 0 ? mapSize : 1;
	},
	right : function (player, mapSize) {
		player.pos.x += player.pos.x === mapSize ? -mapSize : 1;
	},
	down : function (player, mapSize) {
		player.pos.y -= player.pos.y === mapSize ? mapSize : 1;
	},
	left : function (player, mapSize) {
		player.pos.x -= player.pos.x === 0 ? -mapSize : 1;
	}
};


/**
 * move a player in direction 'up', 'right', 'down', 'left'
 * on a map sized mapSite
 *
 * @param  {string} player
 * @param  {string} direciton
 * @param  {number} mapSize
 */
function move (player, direction, mapSize) {
	console.log('moving {' + player.name + '} in direction {' + direction + '}');
	directories[direction](player, mapSize);
}

var exports = {
	move : move
};