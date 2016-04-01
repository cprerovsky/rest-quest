/*global require,console,__dirname*/
/* jshint node:true */
'use strict';

/**
 * Benchmark.js
 * ============
 * 
 * Benchmarking for your Rest Quest client.
 * 
 * This is a drop-in replacement for the regular Rest Quest server.js. 
 * ```
 * node benchmark -[mapNumber]
 * ```
 * Where mapNumber is an integer corresponding to a mapX.js file in
 * the benchmark folder, i.e `node benchmark -2` will load map2.js.
 */

var Express    = require('express.io');
var BodyParser = require('body-parser');
var Game       = require('./lib/game');
var Questmark  = require('./benchmark/questmark');
var both       = require('./lib/both');
var cors       = require('cors');

var State = Game.state();
var App = new Express();

App.use(BodyParser.urlencoded({ extended: true }));
App.use(Express.static(__dirname + '/static'));
App.use(cors());
App.http().io();

var mapNumber = process.argv.filter(arg => /\-\d{1,2}/.test(arg))[0];
Questmark.loadMap(mapNumber);

App.post('/register/', function (req, res) { Questmark.start(State, req, res, App.io); });
App.post('/move/', function (req, res) {
    res = Questmark.patchResponse(res);
    Game.move(State, req, res, App.io);
    // simulate the enemy's move
    Game.move(State, Questmark.enemyReq(), res, App.io);
});
App.get('/reset/', function (req, res) { State = Game.state(); both.clear(); res.send('reset ok'); console.log('reset');});

App.listen(3000);
console.log('Benchmark server started on localhost:3000');
