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
var downButtonIndex =15; 
var upButtonIndex =16; 
var backACIndex =17; 

//Speaking Textbox + character image
var textBoxWidth = 645;
var textBoxHeight = 70;
var earthText = " ";
var earthImage;
var bobImage;
var momImageHappy;
var momImageSad;

//Sound
var sprinklerSound = null;
var waterSound = null;
var clickSound = null;
var completeSound = null;
var doorSound =null;

//Map of house
var mapImage;
var showMap = false;


//Chores varaibles
var water = false;
var checkBob = false;
var trash = false; 
var dirtyLevel = 0;

//Logistics varaibles
var notSeeNote = true; //check if user saw mom's note
var goHome = false; //check if user went home
var textDirty1 = false; //check if earth got dirtier and reveal mirror text 
var textDirty2 = false; //check if earth got dirtier and reveal mirror text 
var tempNumb = 68; //initial temp setup 
var digitalFont;
var talkImage = null; //check if image is other than main player 



//load adventure manager with states and interacions tables
function preload(){
	clickablesManager = new ClickableManager('data/clickableLayout.csv');
	adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
	//add earth image
	earthImage = loadImage('assets/EarthText.png');
	earthImageDirty1 = loadImage('assets/earthImage_dirty1.png');
	earthImageDirty2 = loadImage('assets/earthImage_dirty2.png');
	//load map image
	mapImage = loadImage('assets/Map.png');

	//load sound
	sprinklerSound = loadSound('sound/sprinkler.wav');
	waterSound = loadSound('sound/water.wav');
	clickSound = loadSound('sound/click.wav');
	completeSound = loadSound('sound/complete.wav');
	doorSound = loadSound('sound/door.wav');
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

  adventureManager.changeState("IntroScreen");

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

  //text draw setting
	fill(255);
	textSize(25);

  	//earth text 
 	text(earthText, 268, 590, textBoxWidth, textBoxHeight);

 	//no image of speaker
 	if (adventureManager.getStateName() !== "IntroScreen" && 
 		adventureManager.getStateName() !== "Instructions") {
 	//draw image of earth after checking the dirty level
		drawTalkImage();
 	}

 //show map image when "m" is pressed
 	if (showMap) {
 		image(mapImage, 974, 26);
 	}
}

function keyPressed() {
	adventureManager.keyPressed(key);
	//check if m is pressed 
	if (key === "m") {
		showMap =!showMap; // flips from false to true and vice-versa
	}

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
  // back to our gray color
  this.color = "#ffffff";
  if (adventureManager.getStateName() == "IntroScreen" || adventureManager.getStateName() == "Instructions"){
  	this.textSize = 30;
  }
  else {
  	this.textSize =14;
  }
} 

clickableButtonPressed = function() {
  //change state accordingly
  if (this.id === homeIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name); 
  	//reposition
  	playerSprite.position.x = 460;
	playerSprite.position.y = 480;

	//change goHome to true
	goHome = true; 
  }
  else if (this.id ===landfillIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  	//reposition sprite
  	playerSprite.position.x = 80;
	playerSprite.position.y = 40;
  }
  else if (this.id ===recycleIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  	//reposition sprite
  	playerSprite.position.x = 80;
	playerSprite.position.y = 40;
  }
  else if (this.id ===startIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===instructionsIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===sprinklerIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);

  	//play sprinkler sound
  	sprinklerSound.play();
  }
  else if (this.id ===handSprinklerIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);

  	//play water sound
  	waterSound.play();
  }
  else if (this.id ===nextSIndex) {
  	adventureManager.clickablePressed(this.name);
  	//not environementally friendly way so Earth gets dirtier
  	dirtyLevel = dirtyLevel +1
  	//finished water chore
  	water = true;
  	//play complete sound
  	completeSound.play();


  }
  else if (this.id ===nextHIndex) {
  	adventureManager.clickablePressed(this.name);
  	//finished water chore
  	water = true;
  	//play complete sound
  	completeSound.play();
  }
  else if (this.id ===backIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  	//saw note
  	notSeeNote = false;
  	//reposition
  	playerSprite.position.x = 520;
	playerSprite.position.y = 130;
  }
  else if (this.id ===mirrorIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===backCIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===backD1Index) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===backD2Index) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===homeWIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);

  	//reposition
  	playerSprite.position.x = 460;
	playerSprite.position.y = 480;

  }
  else if (this.id ===downButtonIndex) {
  	//play click sound
  	clickSound.play();

  	tempNumb = tempNumb -1; 
  }
  else if (this.id ===upButtonIndex) {
  	//play click sound
  	clickSound.play();

  	tempNumb = tempNumb +1; 
  }
  else if (this.id ===backACIndex) {
  	//play click sound
  	clickSound.play();

  	adventureManager.clickablePressed(this.name);
  	//reposition player 
  	playerSprite.position.x = 784;
	playerSprite.position.y = 404;
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

function controlerCollide() {
	//change state to AC when collide
	if(adventureManager.getStateName() == "Bob'sRoom") {
		adventureManager.changeState("AC");
	}
}

function dirtyText() {
//lead user to the bathroom when earth gets to dirty level 1
	if (dirtyLevel == 1) {
		if (textDirty1 == false) {
			earthText = "Oh no I think I got dirtier! Let's go to the bathroom to check the mirror.";
			textDirty1 = true; 
		}
	}
	else if (dirtyLevel > 1) {
		if (textDirty2 == false) {
		earthText = "Oh not I got even dirtier! Let's go to the bathroom to check the mirror.";			
		textDirty2 = true; 
		}
	}

}

//check dirty level of earth 
function imageCheck() { 

	if (dirtyLevel == 0) {
		//draw image of earth clean
		image(earthImage, 73,570);
	}
	else if (dirtyLevel == 1) {
		//draw image of earth dirty 1
		image(earthImageDirty1,73, 570);
	}
	else {
		//draw image of earth dirty 2
		image(earthImageDirty2, 73, 570);
	}
}

function drawTalkImage() {
	if (talkImage === null) {
		//draw image of earth
		imageCheck();
	}
	else {
		image(talkImage, 73, 570);
	}
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
	//set text for trash task
	earthText = "Let's throw this box away. But in which bin am I supposed to throw this in?";

	//turn clickables on
	clickables[5].visible = true;
	clickables[6].visible = true;

}
function recycleCollide() {
	if (trash == false) {
		//play complete sound
  		completeSound.play();
	}
	//trash chore completed
	trash = true;
	//earth text after throwing the trash away 
	earthText = "Into the Recycling bin it goes. Let's go back to the Kitchen.";
}
function landfillCollide() {
	if (trash == false) {
		//play complete sound
  		completeSound.play();
	}
	//trash chore completed
	trash = true;
	//gets dirtier
	dirtyLevel = dirtyLevel +1;
	//earth text after throwing the trash away 
	earthText = "Into the Landfill bin it goes. Let's go back to the Kitchen.";
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

function temperature() {
	//change text setting for temperature number
	push();
	textFont(digitalFont);
	textSize(130);
	text(tempNumb, 550, 230);
	pop();
	//check if tempNumb is 72 
	if (tempNumb == 72) {
		if (checkBob == false) {
			//play complete sound
  			completeSound.play();
		}
		//change earth text and update the status of the check bob task
		earthText = "Okay we are good now. I think I am done checking up on Bob and solving his issue." 
		checkBob = true; 
	}
}

function talkBob() {
	//set talkImage to bobImage
	talkImage =bobImage;
	//display bob's message when collided
	earthText = "Let me be! Climate change is not true. Just let me enjoy my AC!"
}

//______________Subclasses_________________//

class FrontYardBefore extends PNGRoom {
	load() {
		super.load();
		//earth text 
		if (water) {
			eathText = "Let's go back in and check the note to see if I missed any chores"; 
		}
		else {
			earthText = "Okay… So I am out in the front yard to water the grass. But how should I water it? ";
		}
	}
	unload() {
		super.unload();
		earthText =" ";
	}
	draw() {
		super.draw();

		//check if watered and show appropriate button and text
		if (water) {
			clickables[3].visible = false;
			clickables[4].visible = false;
		}
		else {
			clickables[0].visible = false;
		}
	}
}

class FrontYardWatered extends PNGRoom {
	draw() {
		super.draw();

		//check if dirty level is greater than 1 and finished water task to show 
		// the state where dome houses are underwater due the water level rising. 
		if (dirtyLevel > 1) {
			if(goHome){
				adventureManager.changeState("FrontYardDirtyAfter");
			}
		}
	}

}

class Kitchen extends PNGRoom {
	preload() { 

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

	unload() {
		super.unload();
		earthText =" ";
	}

	draw() {
		super.draw();

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
		//reveal dirty text when earth gets dirtier
		dirtyText();
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

	unload() {
		super.unload();
		earthText =" ";
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
		//reveal dirty text when earth gets dirtier
		dirtyText();

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

  		//add Mom image 
		momImageHappy = loadImage('assets/momHappy.png');
		momImageSad = loadImage('assets/momSad.png');

	}

	load() {
		super.load();
		if (trash == true && water ==true && checkBob == true) {
			if (dirtyLevel == 0) {
				earthText = "Guys I am back~ Earth! Great job with keeping our earth clean! Play again if you want to see different endings."
			}
			else {
				talkImage = momImageSad;
				earthText = "I am back~ Earth! Why are you so dirty! We have to keep our earth clean! Play again and keep our earth clean."
				
			}
		}
	}

	unload() {
		super.unload();
		earthText =" ";
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
		//reveal dirty text when earth gets dirtier
		dirtyText();

		//ending with mom text
		if (trash == true && water ==true && checkBob == true) {
			if (dirtyLevel == 0) {
				talkImage = momImageHappy;
			}
			else {
				talkImage = momImageSad;	
			}
			// play door sound
			doorSound.play();
		}
	}
}

class EarthRoom extends PNGRoom {
	load() { 
		super.load();

		//check is use saw mom's note
		if (notSeeNote) {
			earthText = "Time to rise and shine! I wonder if Mom is awake. Let's go to her room";
		}
		else {
			earthText = "I should always remember to keep myself clean.";
		}
	}
	unload() {
		super.unload();

		earthText =" ";
	}
}

class BobRoom extends PNGRoom {
	preload() { 

		//creat AC controler sprite for collison
	  	this.controler = createSprite(800, 533, 84, 15);
  		this.controler.addAnimation('controler', loadAnimation('assets/Controler.png'));

  		//create Bob NPC sprite
  		this.bobNPC = createSprite(1066, 310, 44, 132);
  		this.bobNPC.addAnimation('bob', loadAnimation('assets/bob.png'));
	}

	load() {
		super.load()
		
		if (checkBob == false) {
			earthText = "Ah it is so cold in here! Let me check the remote next to the AC.";
		}
		else {
			earthText = "Bob you got to understand that your actions may affect the world we are living on!";
		}

		//add Bob image
		bobImage = loadImage('assets/bobImage.png');
	}

	unload() {
		super.unload();
		earthText =" ";
		talkImage = null;
	}

	draw() {
		super.draw();
		//draw controler sprite
		drawSprite(this.controler);
		//check for overlap with door and main character and switch to next state when collided
		playerSprite.overlap(this.controler,controlerCollide);
		//draw Bob sprite
		drawSprite(this.bobNPC);
		//check for overlap with Bob and main character
		playerSprite.overlap(this.bobNPC, talkBob);
	}
}

class MomRoom extends PNGRoom {
	load() {
		//superclass 
		super.load();

		//check is use saw mom's note
		if (notSeeNote) {
			earthText = "She is not here? Maybe she went out already. I wonder if she wrote a note for me on the fridge."
		}
		else {
			earthText = "I wonder when she is going to come back."
		}
	}

	unload() {
		super.unload();
		earthText =" ";
	}
}

class BackyardRecycle extends PNGRoom {
	preload() { 
		//recycle bin sprite for collison
	  	this.recycle = createSprite(830, 210, 67, 97);
  		this.recycle.addAnimation('recycle', loadAnimation('assets/Recycle.png'));
	}

	load() {
		//superclass 
		super.load();
		earthText = "Why is our backyard so complicated. But I got to find the recycle bin!";
	}

	unload() {
		super.unload();
		earthText =" ";
	}

	draw() {
		super.draw();

		moveSprite();
		
		//draw recycle bin sprite
		drawSprite(this.recycle);
		//checkoverlap
		playerSprite.overlap(this.recycle,recycleCollide);
	}
}

class BackyardLandfill extends PNGRoom {
	preload() { 
		//recycle bin sprite for collison
	  	this.landfill = createSprite(830, 210, 67, 97);
  		this.landfill.addAnimation('landfill', loadAnimation('assets/Landfill.png'));
	}
	load() {
		//superclass 
		super.load();
		//check is if trash task is completed and load appropriate text
		earthText = "Why is our backyard so complicated. But I got to find the landfill bin!";
	}

	unload() {
		super.unload();
		earthText =" ";
	}

	draw() {
		super.draw();

		//draw recycle bin sprite
		drawSprite(this.landfill);
		//checkoverlap
		playerSprite.overlap(this.landfill,landfillCollide);
		imageCheck();
	}
}

class MirrorClean extends PNGRoom {
	draw () {
		//check dirty level and change state of the mirror appropriately
		super.draw();

		print(dirtyLevel);

		if (dirtyLevel ==0 ) {
  			adventureManager.changeState("MirrorClean");
  		}
  		else if (dirtyLevel ==1 ) {
  			adventureManager.changeState("MirrorDirty1");
  		}
  		else {
  			adventureManager.changeState("MirrorDirty2");
  		}
	}
}

class Note extends PNGRoom {
	load() {
		//check which tasks are done and show appropriate text
		super.load();
		if (water == false){
			earthText = "Okay I have to do all of these tasks. Maybe I can start by watering the front yard.";
		}
		else if (trash == false ) {
			earthText = "1 is done. So I guess I can move on to chore number 2."; 
		}
		else if (checkBob == false) {
			earthText = "One more task to do! Hope Bob isn't doing anything bad...";
		}
		else {
			earthText = "Yay! I finished everything. Let's go to the hallway and see if mom is here.";
		}
	}

	unload() {
		super.unload();
		earthText =" ";
	}

	draw() {
		super.draw();
		fill (0,128,0);
		checkmark();
	}
}

class AC extends PNGRoom {
	load() {
		super.load();
		//font for AC number 
		digitalFont = loadFont('fonts/DS-DIGI.ttf');
		//opening text when AC state opens 
		earthText = "OMG! The AC temperature is too low! It just needs to be at 72F to stay comfortable. I will raise it up.";
	}

	unload() {
		super.unload();
		earthText =" ";
	}
	draw() {
		super.draw();
		//reveal appropriate temperature digit
		temperature();
	}
}