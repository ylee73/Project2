## Save Eart (Project 2 )for P5.js
#### by Ashley Lee


### Overview
This is the files using p5.play.js and p5.2DAdventure.js libraries to create a social justice game revolved around the topic of global warming and saving the environment. The game is a RPF style game where the main character, Earth, has to complete the chores that his mom left him while keeping the earth clean. The user will navigate the house using the arrow keyboards and use clickable buttons to select the best method to complete the tasks. Every time the user chooses the non-environmentally friendly option, there will be a signal that global warming is negatively affecting the environment and the main character will get dirtier. 


### Technical Details

Apply p5.play.js, p5.sound.js, p5.2DAdventure.js, and p5.clickable.js for the game. 

The adventureManager reads thorugh the adventureStates.csv, interactionTable.csv, and clickableLayout.csv files to effectively display the right states, clickables, and interactions that is appropriate for state. 

The moveSprite() function allows the playerSprite to move around with the appriopriate animation using the arrow keys. 

The setupClickables() function sets up all interactions each clickable is going to do when pressed, hovered, and displayed. 

Subclasses are created for states that extends the basic PNGRoom to code in the specific load(), unload(), preload(), and draw() needed in that specific state. The appropriate subclass is used in the appropriate state in the adventureManager csv file. 

The unload() will set the earthText back to nothing when leaving the state. 