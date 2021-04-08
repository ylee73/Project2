/***********************************************************************************
  Project2
  by Ashley Lee

  Use the p5.play.js library to create a basic map of the game with 
  moving playerSprite. 

------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.play.js"></script>
  <script src="p5.2DAdventure.js"></script>
  <script src="p5.clickable.js"></script>

***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

//Clickables
var clickablesManager; 
var clickables; //array
var homeIndex = 0; 
var startIndex = 1;
var instructionsIndex =2;
var sprinklerIndex =3;
var handSprinklerIndex =4;
var recycleIndex =5;
var landfillIndex =6;
var nextSIndex =7;
var nextHIndex =8;
var backIndex =9;
var mirrorIndex =10;
var backCIndex =11;
var backD1Index =12;
var backD2Index =13;
var homeWIndex =14; 

//Textbox
var textBoxWidth = 645;
var textBoxHeight = 70;
var earthText;

//Chores varaibles
var water = false;
var checkBob = false;
var trash = false; 
var dirtyLevel = 0;

//Logistics varaibles
var notSeeNote = true; //check if user saw mom's note
var preivousState;


//load adventure manager with states and interacions tables
function preload(){
	clickablesManager = new ClickableManager('data/clickableLayout.csv');
	adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
}

// Setup code 
function setup() {
  createCanvas(1200, 700);

  //setup clickables
  clickables = clickablesManager.setup();

  //create player sprite
  playerSprite = createSprite(500, 160, 70, 70); 

  //add player sprite animation
  playerSprite.addAnimation('still', loadAnimation('assets/earth_frontback1.png'));
  playerSprite.addAnimation('walk', loadAnimation('assets/earth_walk01.png','assets/earth_walk05.png'));
  playerSprite.addAnimation('upDown', loadAnimation('assets/earth_frontback1.png', 'assets/earth_frontback9.png'));

  //track movement with adventureManger
  adventureManager.setPlayerSprite(playerSprite);

  //track visability of clickables per room
  adventureManager.setClickableManager(clickablesManager);

  //load images and use state and interaction tables
  adventureManager.setup();

  adventureManager.changeState("Earth'sRoom");

  //call function to setup additional information about clickables
  setupClickables();
 }

function draw() {
  background(0);
  //draw background of rooms and handle movement
  adventureManager.draw();

  //draw clickables
  clickablesManager.draw();

  //no playersprite for inroscreen, instructions, notes, frontyards, mirror, ac states
  if (adventureManager.getStateName() !== "IntroScreen" &&
  	adventureManager.getStateName() !== "Instructions" &&
  	adventureManager.getStateName() !== "FrontYardBefore" &&
  	adventureManager.getStateName() !== "FrontYardSprinkler" &&
  	adventureManager.getStateName() !== "FrontYardHand" &&
  	adventureManager.getStateName() !== "FrontYardWatered" &&
  	adventureManager.getStateName() !== "FrontYardDirtyAfter" &&
  	adventureManager.getStateName() !== "FrontYardDirtyBefore" &&
  	adventureManager.getStateName() !== "MirrorDirty1" &&
  	adventureManager.getStateName() !== "MirrorDirty2" &&
  	adventureManager.getStateName() !== "MirrorClean" &&
  	adventureManager.getStateName() !== "Note" &&
  	adventureManager.getStateName() !== "AC") {
  	//responds to keydowns
  	moveSprite();

 	 //draw sprite
	drawSprite(playerSprite);
  }

  //record state 
  previousState = adventureManager.getStateName;
}

function keyPressed() {
	adventureManager.keyPressed(key);
}

function mouseReleased() {
	adventureManager.mouseReleased();
}

//_____________playerSprite Movement___________//
function moveSprite() {
	// move side to side
	//walk to the right
	if(keyIsDown(RIGHT_ARROW)) {
		playerSprite.changeAnimation('walk');
		//flip to go right
		playerSprite.mirrorX(1);
		playerSprite.velocity.x = 4;
	}
	//walk to the left
	else if(keyIsDown(LEFT_ARROW)) {
		playerSprite.changeAnimation('walk');
		//flip to go left
		playerSprite.mirrorX(-1);
		playerSprite.velocity.x = -4;
	}
	//move up and down
	//going down
	else if(keyIsDown(DOWN_ARROW)) {
		playerSprite.changeAnimation('upDown');
		playerSprite.velocity.y = 4;
	}
	//walk to the left
	else if(keyIsDown(UP_ARROW)) {
		playerSprite.changeAnimation('upDown');
		playerSprite.velocity.y = -4;
	}
	else {
		playerSprite.changeAnimation('still');
		playerSprite.velocity.x = 0; 
		playerSprite.velocity.y = 0; 
	}
}
//_______________Clickables ___________//
function setupClickables() {
	// All clickables to have same effects
  	for( let i = 0; i < clickables.length; i++ ) {
    	clickables[i].onHover = clickableButtonHover;
    	clickables[i].onOutside = clickableButtonOnOutside;
    	clickables[i].onPress = clickableButtonPressed;
    }
}

clickableButtonHover = function() {
	this.color = "#72CC81";
  	this.noTint = false;
 	this.tint = "#7797e6";
}
//Light gray
 clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#ffffff";
} 

clickableButtonPressed = function() {
  //change state accordingly
  if (this.id === homeIndex) {
  	adventureManager.clickablePressed(this.name); 
  	//reposition
  	playerSprite.position.x = 460;
	playerSprite.position.y = 480;
  }
  else if (this.id ===landfillIndex) {
  	adventureManager.clickablePressed(this.name);
  	//reposition sprite
  	playerSprite.position.x = 80;
	playerSprite.position.y = 40;
	//gets dirtier
	dirtyLevel = dirtyLevel +1;
	print(dirtyLevel);
  }
  else if (this.id ===recycleIndex) {
  	adventureManager.clickablePressed(this.name);
  	//reposition sprite
  	playerSprite.position.x = 80;
	playerSprite.position.y = 40;
  }
  else if (this.id ===startIndex) {
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===instructionsIndex) {
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===sprinklerIndex) {
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===handSprinklerIndex) {
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===nextSIndex) {
  	adventureManager.clickablePressed(this.name);
  	//finished water chore
  	water =true;
  	//not environementally friendly way so Earth gets dirtier
  	dirtyLevel = dirtyLevel +1
  	print(dirtyLevel);
  	print(water);
  }
  else if (this.id ===nextHIndex) {
  	adventureManager.clickablePressed(this.name);
  	//finished water chore
  	water =true;
  	print(water);
  }
  else if (this.id ===backIndex) {
  	adventureManager.clickablePressed(this.name);
  	//saw note
  	notSeeNote = false;
  	print(notSeeNote);
  	//reposition
  	playerSprite.position.x = 520;
	playerSprite.position.y = 130;
  }
  else if (this.id ===mirrorIndex) {
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===backCIndex) {
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===backD1Index) {
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===backD2Index) {
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===homeWIndex) {
  	adventureManager.clickablePressed(this.name);
  	//reposition
  	playerSprite.position.x = 460;
	playerSprite.position.y = 480;
  }
}

function doorCollide() {
	if (adventureManager.getStateName() == "Kitchen") {
		adventureManager.changeState("LivingRoom");
	}
	else if (adventureManager.getStateName() == "LivingRoom") {
		adventureManager.changeState("Hallway");
	}
	else if (adventureManager.getStateName() == "Hallway") {
		//check if water task is done. 
		if (water) {
			adventureManager.changeState("FrontYardWatered")
		}
		//if water task is not done
		else {
			adventureManager.changeState("FrontYardBefore");

		}
	}
	playerSprite.position.x = 400;
	playerSprite.position.y = 90;
}

// move the sprite to appropriate location when moving up from Hallway and Living Room 
function doorCollide2() {
	if (adventureManager.getStateName() == "LivingRoom") {
		adventureManager.changeState("Kitchen");
	}
	else if (adventureManager.getStateName() == "Hallway") {
		adventureManager.changeState("LivingRoom");
	}
	playerSprite.position.x = 400;
	playerSprite.position.y = 480;
}
function noteRead() {
	adventureManager.changeState("Note"); 
	notSeeNote = false; 
}

//pick up box to do the chore
function pickUp() {
	print('collided');
	//turn clickables on
	clickables[5].visible = true;
	clickables[6].visible = true;
}
function recycleCollide() {
	//trash chore completed
	trash = true;
}
function landfillCollide() {
	//trash chore completed
	trash = true;
}
function checkCleanLevel() {
	
}
//add green circle to completed tasks
function checkmark() {
	if (water) {
			circle(270,280,25);
		}
	if (trash) {
			circle(270,313,25);
		}
	if (checkBob) {
			circle(270,386,25);
		}
}

//______________Subclasses_________________//
class FrontYardBefore extends PNGRoom {
	preload() {
		//earth text 
		this.earthTextAfter  = "Let's go back in";
			
		this.earthTextBefore = "Okay… So I am out in the front yard to water the grass. But how should I water it? ";
	}
	
	draw() {
		super.draw();

		//check if dirty
		if (dirtyLevel !== 0) {
			adventureManager.changeState("FrontYardDirtyAfter");
		}

		//text draw setting
		fill(255);
		textSize(25);

		//check if watered and show appropriate button and text
		if (water) {
			text(this.earthTextAfter, 268, 590, textBoxWidth, textBoxHeight);
			clickables[3].visible = false;
			clickables[4].visible = false;
		}
		else {
			text(this.earthTextBefore, 268, 590, textBoxWidth, textBoxHeight);
			clickables[0].visible = false;
		}
	}
}

class FrontYardWatered extends PNGRoom {
	preload() {
		//earth text 
		this.earthText  = "Let's go back in";
	}
	draw() {
		super.draw();
		text(this.earthText, 268, 590, textBoxWidth, textBoxHeight);
	}

}

class Kitchen extends PNGRoom {
	preload() { 

		this.earthTextTrash = "Let's throw this away. But in which bin am I supposedto throw this in?";

		//creat door sprite for collison
	  	this.door = createSprite(440, 540, 240, 20);
  		this.door.addAnimation('door', loadAnimation('assets/Door.png'));

  		//create note sprite for reading mom's note
  		this.note = createSprite(521, 77, 38, 11);
  		this.note.addAnimation('note', loadAnimation('assets/noteIcon.png'));

  		//create box sprite for trash chore
  		this.box = createSprite(905, 463, 48, 33);
  		this.box.addAnimation('box', loadAnimation('assets/box.png'));

	}

	load() {
		//superclass 
		super.load();

		//add earth image
		this.earthImage = loadImage('assets/EarthText.png');
	}

	draw() {
		super.draw();
		text(this.earthTextTrash, 268, 590, textBoxWidth, textBoxHeight);

		//turn clickables off
		clickables[5].visible = false;
		clickables[6].visible = false;

		//draw door sprite
		drawSprite(this.door);
		//check for overlap with door and main character and switch to next state when collided
		playerSprite.overlap(this.door,doorCollide);
		//draw note sprite
		drawSprite(this.note);
		//check for overlap with note and main character and swritch to note state
		playerSprite.overlap(this.note, noteRead);
		//draw box if task not completed 
		if (trash ==false) {
			drawSprite(this.box);
			playerSprite.overlap(this.box, pickUp);
		}
		
		//draw image of earth 
		image(this.earthImage,73,570);
	}
}

class LivingRoom extends PNGRoom {
	preload() { 

		//creat door sprite for bottom door collison
	  	this.door = createSprite(440, 540, 240, 20);
  		this.door.addAnimation('door', loadAnimation('assets/Door.png'));
  		//create door spirte for top door collison
  		this.door2 = createSprite(440, 0, 240, 20);
  		this.door2.addAnimation('door', loadAnimation('assets/Door.png'));

	}
	draw() {
		super.draw();
		//draw door sprite
		drawSprite(this.door);
		//draw door2 sprite
		drawSprite(this.door2);
		//check for overlap with door and main character and switch to next state when collided
		playerSprite.overlap(this.door,doorCollide);
		playerSprite.overlap(this.door2,doorCollide2);

	}
}

class Hallway extends PNGRoom {
	preload() { 

		//creat door sprite for collison
	  	this.door = createSprite(440, 540, 240, 20);
  		this.door.addAnimation('door', loadAnimation('assets/Door.png'));
  		//create door spirte for top door collison
  		this.door2 = createSprite(440, 0, 240, 20);
  		this.door2.addAnimation('door', loadAnimation('assets/Door.png'));

	}
	draw() {
		super.draw();
		//draw door sprite
		drawSprite(this.door);
		//draw door2 sprite
		drawSprite(this.door2);
		//check for overlap with door and main character and switch to next state when collided
		playerSprite.overlap(this.door,doorCollide);
		playerSprite.overlap(this.door2,doorCollide2);
	}
}

class EarthRoom extends PNGRoom {
	preload() { 
		this.earthTextBefore = "Time to rise and shine! I wonder if Mom is awake. Let's go to her room"
		this.earthTextAfter = "I should always remember to keep myself clean."

	}
	draw() {
		super.draw();
		//text draw setting
		fill(255);
		textSize(25);
		//draw text
		//check if user saw the mom's note
		if (notSeeNote) {
			text(this.earthTextBefore, 268, 590, textBoxWidth, textBoxHeight);
		}
		else {
			text(this.earthTextAfter, 268, 590, textBoxWidth, textBoxHeight);
		}
	}
}

class MomRoom extends PNGRoom {
	preload() { 
		this.earthTextBefore = "She is not here? Maybe she went out already. I wonder if she wrote a note for me on the fridge."
		this.earthTextAfter  = "I wonder when she is going to come back."
	}
	draw() {
		super.draw();
		//text draw setting
		fill(255);
		textSize(25);

		//draw text
		//check if user saw the mom's note
		if (notSeeNote) {
			text(this.earthTextBefore, 268, 590, textBoxWidth, textBoxHeight);
		}
		else {
			text(this.earthTextAfter, 268, 590, textBoxWidth, textBoxHeight);
		}
		
	}
}
class BackyardRecycle extends PNGRoom {
	preload() { 
		this.earthTextBefore = "Why does our backyard so complicated. But I got to find the recycle bin!"
		this.earthTextAfter ="Yay! Into the Recycling bin it goes. Let's go back to the Kitchen."
		//recycle bin sprite for collison
	  	this.recycle = createSprite(830, 210, 67, 97);
  		this.recycle.addAnimation('recycle', loadAnimation('assets/Recycle.png'));
	}
	draw() {
		super.draw();

		moveSprite();
		//text draw setting
		fill(255);
		textSize(25);
		if (trash) {
			text(this.earthTextAfter, 268, 590, textBoxWidth, textBoxHeight);
		}
		else {
			text(this.earthTextBefore, 268, 590, textBoxWidth, textBoxHeight);	
		}
		//draw recycle bin sprite
		drawSprite(this.recycle);
		//checkoverlap
		playerSprite.overlap(this.recycle,recycleCollide);
	}
}

class BackyardLandfill extends PNGRoom {
	preload() { 
		this.earthTextBefore = "Why does our backyard so complicated. But I got to find the Landfill bin!"
		this.earthTextAfter = "Into the Landfill bin it goes. Let's go back to the Kitchen."
		//recycle bin sprite for collison
	  	this.landfill = createSprite(830, 210, 67, 97);
  		this.landfill.addAnimation('landfill', loadAnimation('assets/Landfill.png'));
	}
	draw() {
		super.draw();

		//text draw setting
		fill(255);
		textSize(25);
		if (trash) {
			text(this.earthTextAfter, 268, 590, textBoxWidth, textBoxHeight);
		}
		else {
			text(this.earthTextBefore, 268, 590, textBoxWidth, textBoxHeight);	
		}
		//draw recycle bin sprite
		drawSprite(this.landfill);
		//checkoverlap
		playerSprite.overlap(this.landfill,landfillCollide);
	}
}

class MirrorClean extends PNGRoom {
	draw () { 
		super.draw();
		if (dirtyLevel ==0 ) {
  		advnetureManager.changeState("MirrorClean");
  		}
  		else if (dirtyLevel ==1 ) {
  			advnetureManager.changeState("MirrorDirty1");
  		}
  		else if (dirtyLevel ==2 ) {
  			advnetureManager.changeState("MirrorDirty2");
  		}
	}
}
class Note extends PNGRoom {
	draw() {
		super.draw();
		fill (0,128,0);
		checkmark();
	}
}