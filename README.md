# super-bug-zapper
A simple game made with WebGL where you must click on the growing bacteria to 'inject' poison into the bacteria in order to eradicate it.

A 2D game developed for the COSC 414: Computer Graphics class at UBCO.

## Contributors
 - [Emily Medema](https://github.com/emedema)
 - [Mason Plested](https://github.com/MasonPles)

## Project Checklist

1. [x] The playing field starts as a circular disk centered at the origin.
2. [x] The player views the disk from above.
3. [x] Bacteria grow on the circumference of the disk starting at an arbitrary spot on the
circumference and growing out uniformly in each direction from that spot at a speed
determined by the game.
4. [x] The player needs to eradicate the bacteria by placing the mouse over the bacteria and
hitting a button.
5. [x] The effect of the poison administered is to immediately remove the poisoned bacteria.
6. [x] The game can randomly generate up to a fixed number (say 10) of different bacteria
(each with a different color).
7. [x] The bacteria appear as a crust on the circumference of the disk.
8. [x] The game gains points through the delays in the user responding and by any specific
bacteria reaching a threshold (for example, a 30-degree arc).
9. [x] The player wins if all bacteria are poisoned before any two different bacteria reach the
threshold mentioned above.

## Bonus Features

1. [ ] The effect of the poison administered also propagates outward from the point of insertion of the position until all the bacteria are destroyed.
2. [x] When two bacteria cultures collide, the first one to appear on the circumference dominates and consumes the later generated bacteria.
3. [x] When a bacterial culture is hit, use a simple 2D particle system to simulate an explosion at the point where the poison is administered.

## How to Play

This game is played online through the use of your computer's localhost.

This game is not ready yet. This will be updated once it is ready to play.
