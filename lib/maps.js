'use strict';

/**
 * create a random map
 * 
 * @return {Array.<Array>}
 */
function create () {
	var map = [];
	var row;

	for (var rowNum=0; rowNum<10; rowNum++) {
		row = [];		
		for (var colNum=0; colNum<10; colNum++) {
			row.push({
				type : 'grass'
			});
		}
		map.push(row);
	}
}

/**
 * 
 */
function tile () {

}


var exports = {
	create : create
};