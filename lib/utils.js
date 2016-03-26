/* global module */
'use strict';

function rand (num) {
	return parseInt(Math.random() * num);
}

function log(msg) {
    var n = (new Date()).toISOString();
    console.log(`[${n}] ${msg}`);
}

module.exports = {
	rand : rand,
    log  : log
};