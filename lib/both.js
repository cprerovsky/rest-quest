/*global module*/
'use strict';

var bothLot = {};
var onceLot = {};

var fakeOnce = {};
fakeOnce.prototype.once = function() {};

/**
 * both will park callbacks in a parking lot until
 * the second cb for that name arrives an then will
 * invoke both at once. Will return an object with
 * a method "once", that will be triggered once after
 * the two callbacks have been triggered.
 *
 * @param  {string} name
 * @param  {function} cb
 * @return {Object}
 */
function both (name, cb) {
	if (bothLot[name]) {
		bothLot[name]();
		cb();
		delete bothLot[name];

		if (onceLot[name]) {
			onceLot[name]();
			delete onceLot[name];
		}

		return fakeOnce;
	}

	bothLot[name] = cb;
	var o = {};
	o.once = function (cbOnce) {
		onceLot[name] = cbOnce;
	};
	return o;
}

module.exports = both;