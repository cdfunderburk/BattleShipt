# Battleshipt

Play battleship with a friend or against the computer.

## Dependencies

This game was built without dependencies.

## Game Requirements

+ 2 Players ( Player 1 vs. Computer or Player 1 vs. Player 2)
+ Each Player has a grid on which to place ships
+ The game begins once both players have placed their ships
+ The players take turns choosing a position on the opponent's grid to attack

## Game Play
Each player has a grid like the one below:

![ Game Board](https://s3.us-east-2.amazonaws.com/battleshipt/Screen+Shot+2019-04-26+at+6.54.00+PM.png)


####Game Setup
Each player has 4 ships ( each ship has two grid positions).  The ship's grid positions must be placed next to each other and either vertical or horizontal as shown below:

![ Game Setup](https://s3.us-east-2.amazonaws.com/battleshipt/Screen+Shot+2019-04-26+at+6.54.52+PM.png)

####Hit
 When the space that was chosen has a ship placed on it, the space will display a red X:

![ Hit](https://s3.us-east-2.amazonaws.com/battleshipt/Screen+Shot+2019-04-26+at+6.54.35+PM.png)


####Miss 
 When the space chosen does not have a ship placed on it the space will display a white X:

![Miss](https://s3.us-east-2.amazonaws.com/battleshipt/Screen+Shot+2019-04-26+at+6.54.22+PM.png)


####Already Taken
If the position has previously been attacked or a ship has already been placed in the position then the user will be prompted that the space is already taken.

####Sunk 
If all the positions a ship covers have been hit then the user will be prompted that the ship has been sunk

####Win
If all the player's ships have been sunk then the user will be prompted that the game is over.


####Restart Game
To restart the game simply click the refresh button or 

## Install

From Terminal follow these commands.

`git clone INSERT GIT REPO`

`cd battleship`

## Start Game

`open index.html`
