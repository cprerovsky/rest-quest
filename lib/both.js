/*global module*/
'use strict';

var bothLot = {};
var doneLot = {};

var fakeOnce = function () {};
fakeOnce.prototype.done = function() {};
fakeOnce = new fakeOnce();

/**
 * both will park callbacks in a parking lot until
 * the second cb for that name arrives an then will
 * invoke both at once. Will return an object with
 * a method "done", that will be triggered once after
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

		if (doneLot[name]) {
			doneLot[name]();
			delete doneLot[name];
		}

		return fakeOnce;
	}

	bothLot[name] = cb;
	var o = {};
	o.done = function (cbOnce) {
		doneLot[name] = cbOnce;
	};
	return o;
}

both.clear = function () {
	bothLot = {};
	doneLot = {};
};

module.exports = both;