/* global module */
'use strict';

function error(msg) {
	throw Error(msg);
}

function registryOpen (players) {
	if (Object.keys(players).length >= 2) {
		error('Registration closed');
	}
}

function registryClosed (players) {
	if (Object.keys(players).length < 2) {
		error('Registration not completed');
	}	
}

module.exports = {
	registryOpen   : registryOpen,
	registryClosed : registryClosed
};