/* global module, require */
'use strict';

var Utils = require('./utils');

/**
 * create a random map
 *
 * @return {Array.<Array>}
 */
function create () {
	var map = {
		size : parseInt(Math.random() * 7 + 8, 10),
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

	// treasures
	var treasureTile;
	for (var i=0; i<2; i++) {
		treasureTile = placementTile(map);
		map.rows[treasureTile.y][treasureTile.x].treasure = true;
	}

	return map;
}

/**
 * returns a tile that is ready for special placement
 * eg. castles or artefacts
 */
function placementTile (map) {
	var tile;
	var y;
	var x;

	while (!isValidPlacementTile(tile)) {
		x = Utils.rand(map.size - 1);
		y = Utils.rand(map.size - 1);
		tile = map.rows[y][x];
	}

	return {
		tile : tile,
		x    : x,
		y    : y
	};
}

/**
 * figure out if a tile is valid for placement of a castle or treasure
 */
function isValidPlacementTile(tile) {
	return tile && tile.type !== 'water' &&	!tile.castle &&	!tile.treasure;
}

/**
 * canonicalize a coord according to map size
 */
function canonicalCoord (coord, size) {
	if (coord < 0) {
		return coord % size + size;
	}
	if (coord >= size) {
		return coord % size;
	}
	return coord;
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
		t = 'forest';
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
		return { x : pos.x, y : canonicalCoord(pos.y + 1, mapSize) };
	},
	right : function (pos, mapSize) {
		return { x : canonicalCoord(pos.x + 1, mapSize), y : pos.y };
	},
	down : function (pos, mapSize) {
		return { x : pos.x, y : canonicalCoord(pos.y - 1, mapSize) };
	},
	left : function (pos, mapSize) {
		return { x : canonicalCoord(pos.x - 1, mapSize), y : pos.y };
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

/**
 * get the view from a pos on the map
 *
 * @param  {Object.<string,number>} pos
 * @param  {Object.<string,*} map
 * @return {Array.<Array>}
 */
function view (pos, map) {
	var distances = {
		forest   : 1,
		grass    : 2,
		mountain : 3
	};

	var vdist = distances[get(pos, map).type];
	var rows = [];
	for (var offY=vdist; offY>=-vdist; offY--) {
		var cols = [];
		for (var offX=-vdist; offX<=vdist; offX++) {
			cols.push(get({
				x: pos.x + offX,
				y: pos.y + offY
			}, map));
		}
		rows.push(cols);
	}

	return rows;
}

/**
 * get pos from map
 */
function get (pos, map) {
	return map.rows[canonicalCoord(pos.y, map.size)][canonicalCoord(pos.x, map.size)];
}

module.exports = {
	create        : create,
	get           : get,
	move          : move,
	view          : view,
	placementTile : placementTile
};
