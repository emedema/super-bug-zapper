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

## Installation

To install this game all you need are the files and a web browser!

1. Download the files from github.
2. Place them where you want to store them.
3. Double click the `index.html` file so that it opens in your default browser and start playing!

## How to Play

Once you have the file showing in the browser you start playing immediately!

The goal of the game is to keep the black circle/plate clean from the bacteria growing on its circumference. The bacteria will continue to grow at a steady rate (unless they collide, in which case they combine). To get rid of bacteria you administer poison to them via clicking on the bacteria. Immediately after you administer the poison, the bacteria will disappear. 

At the start of each game, 10 bacteria will appear on the plate. They will immediately start growing and depending on where they appear on the circumference, they may immediately start combining. 

The longer you wait before eradicating the bacteria, the more points you gain! Be careful to not wait too long, else they might grow too big and you will lose. If the bacteria grow too big, you will not only lose a life, but 20 points. Likewise, if you misclick you will lose 20 points.

**How to Win:**

A player wins when all the bacteria have been eradicated before any two bacteria can grow too big. You must have a positive score or a score of zero in order to win!

The conditions for losing are as follows: 
- If the score is less than 0, either you had too many missed clicks or the two bacteria grew to be too big.
- Any two of the bacteria grew too big, if you have a positive score at this point it will automatically be reduced to -1.

