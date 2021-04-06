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
var homeIndex = 0; //"home" clickable index 

//Textbox
var textBoxWidth = 645;
var textBoxHeight = 70;

//Chores varaibles
var water = false;
var checkBob = false;

//Logistics varaibles
var seeNote = false; //check if user saw mom's note

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

  //call function to setup additional information about clickables
  setupClickables();
 }

function draw() {
  background(0);
  //draw background of rooms and handle movement
  adventureManager.draw();

  //draw clickables
  clickablesManager.draw();

  //responds to keydowns
  moveSprite();

  //draw sprite
  drawSprite(playerSprite);
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
		adventureManager.changeState("FrontYardBefore");
	}
}

//______________Subclasses_________________//
class FrontYardBefore extends PNGRoom {
	preload() {
		//chekc if water chore is done
		if (water) {
			this.homeText = "Let's go back in";
		}
		else {
			this.homeText = "Okay… So I am out in the front yard to water the grass. But how should I water it? ";
		}
	}
	
	draw() {
		super.draw();

		//text draw setting
		fill(255);
		textSize(25);

		//draw text
		text(this.homeText, 268, 590, textBoxWidth, textBoxHeight);
	}
}
class Kitchen extends PNGRoom {
	preload() { 

		//creat door sprite for collison
	  	this.door = createSprite(320, 540, 20, 20);
  		this.door.addAnimation('door', loadAnimation('assets/Door.png'));

	}
	draw() {
		super.draw();
		//draw door sprite
		drawSprite(this.door);
		//check for overlap with door and main character and switch to next state when collided
		playerSprite.overlap(this.door,doorCollide);
	}
}

class LivingRoom extends PNGRoom {
	preload() { 

		//creat door sprite for collison
	  	this.door = createSprite(320, 540, 20, 20);
  		this.door.addAnimation('door', loadAnimation('assets/Door.png'));

	}
	draw() {
		super.draw();
		//draw door sprite
		drawSprite(this.door);
		//check for overlap with door and main character and switch to next state when collided
		playerSprite.overlap(this.door,doorCollide);
	}
}

class Hallway extends PNGRoom {
	preload() { 

		//creat door sprite for collison
	  	this.door = createSprite(320, 540, 20, 20);
  		this.door.addAnimation('door', loadAnimation('assets/Door.png'));

	}
	draw() {
		super.draw();
		//draw door sprite
		drawSprite(this.door);
		//check for overlap with door and main character and switch to next state when collided
		playerSprite.overlap(this.door,doorCollide);
	}
}