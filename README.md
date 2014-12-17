# REST Quest

Write a client that consumes server.js's REST API, grabs a **treasure** and returns to your **castle** faster than your opponent.

## API

1. ```/register/``` your player by sending a POST request with your ```name```
2. wait for your POST request to be answered by the server with a view
3. POST your next move to ```/move/``` with ```player```containing your name and ```direction``` the direction you want to move to. The server will also answer with a view


## What is a 'view'?

A view is an array of an array of objects that describes the surrounding tiles you can see. As different terrains provide different visibility, the array size can change.

```[
	[ {"type": "grass"}, {"type": "mountain"}, {"type": "mountain"} ],
	[ {"type": "grass"}, {"type": "forest"}, {"type": "water"} ],
	[ {"type": "grass"}, {"type": "water"}, {"type": "water"} ]
]```

Different terrains allow for different visiblity

* forest: 3x3 view
* grass: 4x4 view
* mountain: 5x5 view

Your avatar is always positioned at the **center** of the view, so in the previous example he is positioned on the only forest tile.

### Tiles

The tiles contained in a view can contain the following data:

```{
	"type":     "grass", // the tile type
	"castle":   "[playername]", // castle of a player named [playername]
	"treasure": true // treasure
}```
## Movement

You can ```/move/``` either

* ```up```
* ```down```
* ```left```
* ```right```

Moving up a mountains takes **two** consecutive turns of moving in the same direction. So if you want to climb a mountain tile in direction ```up``` you will have to send the ```up``` direction twice - in two separate requests. Moving onto **water** or the **enemy castle** will **instantly kill you**.

## Game Over

When the game is over because you or your opponent died, or took a treasure to the castle you will receive a game over response.

```{
	"game"   : "over",
	"result" : "won" // won, lost or draw
}```
