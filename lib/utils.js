/* global module */
'use strict';

function rand (num) {
	return parseInt(Math.random() * num);
}

module.exports = {
	rand : rand
}