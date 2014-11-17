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


var exports = {
	create : create
};