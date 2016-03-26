/* global module */
'use strict';

function rand (num) {
	return parseInt(Math.random() * num);
}

function log(msg) {
    var n = (new Date()).toISOString();
    console.log(`[${n}] ${msg}`);
}

function httpdump(req, res, next) {
    log(`${req.ip} => ${req.url}`);
    console.log('HEADERS\n', req.headers);
    console.log('BODY\n', req.body);
    next();
}

module.exports = {
	rand : rand,
    log  : log,
    httpdump: httpdump
};