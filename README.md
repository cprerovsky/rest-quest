# REST Quest

Write a client that consumes server.js's REST API, grabs a **treasure** and returns to your **castle** faster than your opponent.

## Installation

**Prerequisites**

You'll need NodeJS (https://nodejs.org), NPM (included in NodeJS) and Git installed on your machine.

**Installation**

Clone the repository and run ```npm install```:

```
git clone git@github.com:cprerovsky/rest-quest.git
cd rest-quest
npm install
```

If you don't have a github account, cloning the repository will not be possible. In this case you can download the latest release as a zip file: https://github.com/cprerovsky/rest-quest/archive/master.zip

**Run**

Run the server using ```node```

```
node server.js
```

Now point your browser to http://localhost:3000.

When the server is running you can connect two clients one after another.
A really stupid test client is included in the package, which you can start
twice to see if everything runs fine:

```
node client.js & node client.js
```

As soon as you start the clients a map appears in the browser and the two
clients will start to battle it out like two drunk roombas.

## API

1. ```/register/``` your player by sending a POST request with your ```name```
2. wait for your POST request to be answered by the server with a ```view```
3. POST your next move to ```/move/``` with ```player```containing your name and ```direction``` the direction you want to move to. The server will also answer with a view


## What is a ```view```?

A view is an array of an array of objects that describes the
surrounding tiles you can see. As different terrains provide
different visibility, the array size can change.

```
{
    view: [
        [ {"type": "grass"}, {"type": "mountain"}, {"type": "mountain"} ],
        [ {"type": "grass"}, {"type": "forest"}, {"type": "water"} ],
        [ {"type": "grass"}, {"type": "water"}, {"type": "water"} ]
    ],
    treasure: false
}
```

Included with the ```view``` the server response also contains
the ```treasure``` parameter, which tells you whether you successfully
picked up the treasure from the map. The other player might have
snatched the treasure the moment before you moved on the target square,
so this field is for you to document whether you picked it up successfully.

## Range of vision

Different terrains allow for different range, thus changing the size
of the view returned.

* forest: will give you a 3x3 view of your surroundings
* grass: 5x5 view
* mountain: 7x7 view

Your avatar is always positioned at the **center** of the view, so in the previous example he is positioned on the only forest tile.

### Tiles

The tiles contained in a view can contain the following data:

```
{
	"type":     "grass", // the tile type
	"castle":   "[playername]", // castle of a player named [playername]
	"treasure": true // treasure
}
```
## Movement

You can ```/move/``` either

* ```up```
* ```down```
* ```left```
* ```right```

Moving up a mountains takes **two** consecutive turns of moving in the same direction. So if you want to climb a mountain tile in direction ```up``` you will have to send the ```up``` direction twice - in two separate requests. Moving onto **water** or the **enemy castle** will **instantly kill you**.

## Invalid Operation

If you violate protocol, eg. by invoking the ```/move/``` API even though the game has not been startet yet, you will receive an ```Invalid Operation Response```:

```
{ error : 'Invalid Operation' }
```

## Game Over

When the game is over because you or your opponent died, or took a treasure to the castle you will receive a game over response.

```
{
	"game"   : "over",
	"result" : "won" // won, lost or draw
}
```

## Benchmarking

To run benchmarks against your client, run:
```
node benchmark -[mapNumber]
```
Where mapNumber is an integer corresponding to a mapX.js file in
the benchmark folder, i.e `node benchmark -2` will load `map2.js`.

The benchmark uses a hard-coded map and outputs stats about how your
client performed at the end of the game. 

# Changelog

## Version 0.3.0

* added benchmark framework

## Version 0.2.0

* added think time calculation
* vastly improved logging
* improved documentation