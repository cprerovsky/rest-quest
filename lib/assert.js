/* global module */
'use strict';

function registryOpen (players) {
	if (Object.keys(players).length >= 2) {
		throw 'Registration closed';
	}
}

function registryClosed (players) {
	if (Object.keys(players).length < 2) {
		throw 'Registration not completed';
	}	
}

module.exports = {
	registryOpen   : registryOpen,
	registryClosed : registryClosed
};