'use strict';

/**
 * create a random map
 * 
 * @return {Array.<Array>}
 */
function create () {
	var map = {
		size : 10,
		rows : []
	};
	var row;

	for (var rowNum=0; rowNum<map.size; rowNum++) {
		row = [];		
		for (var colNum=0; colNum<map.size; colNum++) {
			row.push(tile());
		}
		map.rows.push(row);
	}

	return map;
}

/**
 * generate a random tile
 *
 * @return {Object.<string,string>}
 */
function tile () {
	var r = Math.random();
	var t = 'grass';
	if (r > 0.5) {
		t = 'wood';
	}
	if (r > 0.7) {
		t = 'mountain';
	}
	if (r > 0.9) {
		t = 'water';
	}
	return { type : t };
}

var directories = {
	up : function (pos, mapSize) {
		return pos.y === 0 ?
			{ x : pos.x, y : --mapSize } :
			{ x : pos.x, y : pos.y-- };
	},
	right : function (pos, mapSize) {
		return pos.x === mapSize - 1 ?
			{ x : 0, y : pos.y } :
			{ x : pos.x++, y : pos.y };
	},
	down : function (pos, mapSize) {
		return pos.y === mapSize - 1 ?
			{ x : pos.x, y : 0 } :
			{ x : pos.x, y : pos.y++ };
	},
	left : function (pos, mapSize) {
		return pos.x === 0 ?
			{ x : --mapSize, y : pos.y } :
			{ x : pos.x--, y : pos.y };
	}
};

/**
 * move from position pos in direction 'up', 'right', 'down', 'left'
 * on a map sized mapSize start and receive an updated pos
 *
 * @param  {Object.<string,number>} pos
 * @param  {string} direciton
 * @param  {number} mapSize
 * @return {Object.<string,number>}
 */
function move (pos, direction, mapSize) {
	return directories[direction](pos, mapSize);
}

var exports = {
	create : create,
	move : move
};