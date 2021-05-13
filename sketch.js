/***********************************************************************************
  Save Earth (Project2)
  by Ashley Lee

 This is the files using p5.play.js and p5.2DAdventure.js libraries to create a 
 social justice game revolved around the topic of global warming and saving the environment. 
 The game is a RPG style game where the main character, Earth, has to complete the chores 
 that his mom left him while keeping the earth clean. The user will navigate the house 
 using the arrow keyboards and use clickable buttons to select the best method to complete 
 the tasks. Every time the user chooses the non-environmentally friendly option, there will be 
 a signal that global warming is negatively affecting the environment and the main character 
 will get dirtier. 

Update: 
New computer interaction where Earth deletes his junk emails to free up some 
memory to lower carbon emission. 
New outside map with neighbors and market. 
New outside taks to checkup on neighobors and help them out if they need any help. 
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
var outsideIndex =18;
var emailIndex =19;
var deleteIndex =20;
var exitIndex =21;
var plasticBagIndex =22;
var recycleBagIndex =23;

//Speaking Textbox + character image
var textBoxWidth = 645;
var textBoxHeight = 90;
var earthText = " ";
var earthImage;
var bobImage;
var momImageHappy;
var momImageSad;
var beachImage;
var sweetImage;
var shopOwnerImage;

//Sound
var sprinklerSound = null;
var waterSound = null;
var clickSound = null;
var completeSound = null;

//Map of house
var mapImage;
var showMap = false;


//Chores varaibles
var water = false;
var checkBob = false;
var trash = false; 
var dirtyLevel = 0;
var homeTask = false;
var neighbor = false; 
var marketTask = false;
var giveBack = false;

//Logistics varaibles
var notSeeNote = true; //check if user saw mom's note
var computerTask = false; //check if user compeleted the email task
var goHome = false; //check if user went home
var textDirty1 = false; //check if earth got dirtier and reveal mirror text 
var textDirty2 = false; //check if earth got dirtier and reveal mirror text 
var tempNumb = 68; //initial temp setup 
var digitalFont; //font for AC task
var talkImage = null; //check if image is other than main player 
var visitMrBeach= false; //check if user met Mr.Beach
var visitMsSweet = false; // check if uesr met Ms.Sweet
var checkUp = false; //see flooded state 

function preload(){
	//load adventure manager with states and interacions tables
	clickablesManager = new ClickableManager('data/clickableLayout.csv');
	adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
	//add earth image
	earthImage = loadImage('assets/EarthText.png');
	earthImageDirty1 = loadImage('assets/earthImage_dirty1.png');
	earthImageDirty2 = loadImage('assets/earthImage_dirty2.png');
  earthImageDirty3 = loadImage('assets/earthImage_dirty3.png');
  earthImageDirty4 = loadImage('assets/earthImage_dirty4.png');
	//load map image
	mapImage = loadImage('assets/Map.png');
	//load sound
	sprinklerSound = loadSound('sound/sprinkler.wav');
	waterSound = loadSound('sound/water.wav');
	clickSound = loadSound('sound/click.wav');
	completeSound = loadSound('sound/complete.wav');
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
    adventureManager.getStateName() !== "MirrorDirty3" &&
    adventureManager.getStateName() !== "MirrorDirty4" &&
  	adventureManager.getStateName() !== "MirrorClean" &&
  	adventureManager.getStateName() !== "Note" &&
  	adventureManager.getStateName() !== "AC" &&
  	adventureManager.getStateName() !== "ComputerStart" &&
  	adventureManager.getStateName() !== "ComputerEmail" &&
  	adventureManager.getStateName() !== "ComputerClean") {
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

 	//no image of speaker in intro and instructions state
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
		playerSprite.velocity.x = 6;
	}
	//walk to the left
	else if(keyIsDown(LEFT_ARROW)) {
		playerSprite.changeAnimation('walk');
		//flip to go left
		playerSprite.mirrorX(-1);
		playerSprite.velocity.x = -6;
	}
	//move up and down
	//going down
	else if(keyIsDown(DOWN_ARROW)) {
		playerSprite.changeAnimation('upDown');
		playerSprite.velocity.y = 6;
	}
	//walk to the left
	else if(keyIsDown(UP_ARROW)) {
		playerSprite.changeAnimation('upDown');
		playerSprite.velocity.y = -6;
	}
  //stay still
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
  //increase button text font in intro and instructions state 
  if (adventureManager.getStateName() == "IntroScreen" || adventureManager.getStateName() == "Instructions"){
  	this.textSize = 30;
  }
  else {
  	this.textSize = 14;
  }
} 

clickableButtonPressed = function() {
  if (this.id === homeIndex) {
  	//play click sound
  	clickSound.play();
  	 //change state accordingly to button
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

  	//reposition player
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
  else if (this.id ===emailIndex) {
  	//play click sound
  	clickSound.play();
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===deleteIndex) {
  	//play click sound
  	clickSound.play();
  	adventureManager.clickablePressed(this.name);
  }
  else if (this.id ===exitIndex) {
  	//play click sound
  	clickSound.play();
  	//computer task is done 
  	computerTask = true; 
  	adventureManager.clickablePressed(this.name);
  	//reposition
  	playerSprite.position.x = 190;
	 playerSprite.position.y = 390;
  }
  else if (this.id ===outsideIndex) {
    //play click sound
    clickSound.play();
    adventureManager.clickablePressed(this.name);
    //reposition
    playerSprite.position.x = 585;
    playerSprite.position.y = 201;
  }
  else if (this.id ===plasticBagIndex) {
    //play click sound
    clickSound.play();
    //gets dirtier
    dirtyLevel = dirtyLevel +1;
    adventureManager.clickablePressed(this.name);
    //reposition
    playerSprite.position.x = 580;
    playerSprite.position.y = 70;
  }
  else if (this.id ===recycleBagIndex) {
    //play click sound
    clickSound.play();
    adventureManager.clickablePressed(this.name);
    //reposition
    playerSprite.position.x = 580;
    playerSprite.position.y = 70;
  }
}
//___________Functions for Game Logistics___________//
//When playerSprite collide with the down door
function doorCollide() {
	if (adventureManager.getStateName() == "Kitchen") {
		adventureManager.changeState("LivingRoom");
    playerSprite.position.x = 400;
    playerSprite.position.y = 90;
	}
	else if (adventureManager.getStateName() == "LivingRoom") {
		adventureManager.changeState("Hallway");
    playerSprite.position.x = 400;
    playerSprite.position.y = 90;
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
    playerSprite.position.x = 400;
     playerSprite.position.y = 90;
	}
  else if (adventureManager.getStateName() == "Ms.SweetHouse") {
    adventureManager.changeState("Cross");
    playerSprite.position.x = 580;
    playerSprite.position.y = 70;
  }
}

//when playerSprite collide with the AC controler 
function controlerCollide() {
	//change state to AC when collide
	if(adventureManager.getStateName() == "Bob'sRoom") {
		adventureManager.changeState("AC");
	}
}

//wheck the dirty level of the player and display appropriate text 
function dirtyText() {
//lead user to the bathroom when earth gets dirtier
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

//check dirty level of earth and display appropriate image for textimage
function imageCheck() { 
	if (dirtyLevel == 0) {
		//draw image of earth clean
		image(earthImage, 73,570);
	}
	else if (dirtyLevel == 1) {
		//draw image of earth dirty 1
		image(earthImageDirty1,73, 570);
	}
  else if (dirtyLevel == 2) {
    //draw image of earth dirty 1
    image(earthImageDirty2,73, 570);
  }
  else if (dirtyLevel == 3) {
    //draw image of earth dirty 1
    image(earthImageDirty3,73, 570);
  }
	else {
		//draw image of earth dirty 4
		image(earthImageDirty4, 73, 570);
	}
}

//drawTalkImage of earth when null and image of Bob or Mom when they are speaking
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
    playerSprite.position.x = 400;
    playerSprite.position.y = 480;
	}
	else if (adventureManager.getStateName() == "Hallway") {
		adventureManager.changeState("LivingRoom");
    playerSprite.position.x = 400;
    playerSprite.position.y = 480;
	}
  else if (adventureManager.getStateName() == "Cross") {
    adventureManager.changeState("Ms.SweetHouse");
    playerSprite.position.x = 580;
    playerSprite.position.y = 480;
  }
}

//move state to Note
function noteRead() {
	adventureManager.changeState("Note"); 
	notSeeNote = false; 
}

//pick up box and display options on how to throw it away
function pickUp() {
	//set text for trash task
	earthText = "Let's throw this box away. But in which bin am I supposed to throw this in?";

	//turn clickables on for "recycle" and "landfill"
	clickables[5].visible = true;
	clickables[6].visible = true;
}

//when put box in recycling bin
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

//when put box in landfill bin 
function landfillCollide() {
	if (trash == false) {
		//play complete sound
  	completeSound.play();
    //gets dirtier
    dirtyLevel = dirtyLevel +1;
	}
	//trash chore completed
	trash = true;
	//earth text after throwing the trash away 
	earthText = "Into the Landfill bin it goes. Let's go back to the Kitchen.";
}

//add green circle to completed tasks
function checkmark() {
	if (water) {
			circle(270,245,25);
		}
	if (trash) {
			circle(270,280,25);
		}
	if (checkBob) {
			circle(270,350,25);
		}
  if (marketTask) {
      circle(270,420,25);
    }
}

//AC task in Bob's room 
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

//Bob NPC text and image display
function talkBob() {
	//set talkImage to bobImage
	talkImage =bobImage;
	//display bob's message when collided
	earthText = "Let me be! Climate change is not true. Just let me enjoy my AC!"
}

function computerCollide() {
	adventureManager.changeState("ComputerStart");
}

function houseCollide() {
  adventureManager.changeState("Hallway");
  //reposition
  playerSprite.position.x = 400;
  playerSprite.position.y = 480;
}
function marketCollide() {
  adventureManager.changeState("MarketInside");
  //reposition
  playerSprite.position.x = 60;
  playerSprite.position.y = 360;
}
//Mr.Beach NPC text and image display
function talkBeach() {
  //talked to Mr.Beach
  visitMrBeach = true;
  //set talkImage to beachImage
  talkImage =beachImage;
  //display Mr.Beach's message when collided
  if (adventureManager.getStateName() == "Mr.BeachHouseWater") {
    //text if state is under water
    earthText = "My house! It is underwater... What am I going to do now."
  }
  else {
    earthText = "I am worried that my house will be under water. The sea level have been rising continuously. I may look like Bob with a hat and mustache, but I am not Bob.";
  }
}
//Ms.Sweet NPC text and image display
function talkSweet() {
  //talked to Ms.Sweet
  visitMsSweet = true;
  //set talkImage to sweetImage
  talkImage =sweetImage;
  //display Ms.Sweet's message when collided
  if (marketTask == false){
    //text to introduce market task
    earthText = "I actually need your help. Can you get me any source of protein from the market? Here is a reusable bag or you can get a plastic bag from the shop.";
    //show buttons
    clickables[22].visible = true;
    clickables[23].visible = true;
  }
  else {
    //when finish market task
    earthText = "Thank you! I needed this for dinner."
    giveBack = true; 
    print ('giveback' + giveBack);
  }
}
function talkShopOwner() {
  //set talkImage to ShopOwner
  talkImage = shopOwnerImage;
  //display Shop Owner's message when collided
  if (marketTask){
    earthText = "No need to pay. I got a call from Ms.Sweet. But did you know that meat actually accounts for around 14.5% of greenhouse gas emission! Just something that I read.";
  }
}

function meatCollide() {
  if (marketTask == false) {
    //play complete sound
      completeSound.play();
    //gets dirtier 
    dirtyLevel = dirtyLevel +1;  
  }
  //market task completed
  marketTask = true;
  print(marketTask);
}

function eggCollide() {
  if (marketTask == false) {
    //play complete sound
      completeSound.play();
  }
  //market task completed
  marketTask = true;
}
//door to go outside the market
function marketDoorCollide() {
  adventureManager.changeState("MarketOutside");
  //reposition
  playerSprite.position.x = 500;
  playerSprite.position.y = 500;
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

		//check if watered and show appropriate buttons
		if (water) {
			clickables[3].visible = false;
			clickables[4].visible = false;
		}
		else {
			clickables[0].visible = false;
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
	load() {
		super.load();
    //creat door sprite for collison
    this.door = createSprite(440, 540, 240, 20);
    this.door.addAnimation('door', loadAnimation('assets/Door.png'));
    //create door spirte for top door collison
    this.door2 = createSprite(440, 0, 240, 20);
    this.door2.addAnimation('door', loadAnimation('assets/Door.png'));

    //add Mom image 
    momImageHappy = loadImage('assets/momHappy.png');
    momImageSad = loadImage('assets/momSad.png');
		//check if all the home tasks are completed
		if (trash == true && water ==true && checkBob == true ) {
      //when all the tasks are finsihed
      if (giveBack == true) {
        if (dirtyLevel == 0) {
          earthText = "Guys I am back~ Earth! Great job with keeping our earth clean! Play again if you want to see different endings."
        }
        //when earth is dirty 
        else {
          earthText = "I am back~ Earth! Why are you so dirty! Go look at yourself in the mirror and reflect on your actions. Play again and keep our earth clean."
        }
      }
      //if finish all the home tasks
      else {
        earthText = "I think I am done with all the tasks within the house. I guess I should go out and see if any of my neighbors need my help."
      }
		}
	}
	unload() {
		super.unload();
		earthText =" ";
    talkImage == null;
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
    if (trash ==false || water ==false ||checkBob ==false || giveBack ==false) {
      dirtyText();
    }

		//ending with mom text
		if (trash == true && water ==true && checkBob == true) {
			homeTask = true;
			if (giveBack == true){
				if (dirtyLevel == 0) {
					talkImage = momImageHappy;
				}
				else {
					talkImage = momImageSad;	
				}
			}
		}

	}
}

class EarthRoom extends PNGRoom {
	load() { 
		super.load();
		//check if user completed email task
		if (computerTask == false) {
			earthText ="Time to rise and shine! Let's jump onto the computer to see if I got any new emails.";
		}
		//check is user saw mom's note
		else if (notSeeNote) {
			earthText = "I wonder if Mom is awake. Let's go to her room.";
		}
		//text if already saw mom's note 
		else {
			earthText = "I should always remember to keep myself clean.";
		}
		this.computer = createSprite(145,495,170,72);
		this.computer.addAnimation('computer', loadImage('assets/Computer.png'));
	}

	unload() {
		super.unload();
		earthText =" ";
	}

	draw() {
		super.draw();
		drawSprite(this.computer); 
		playerSprite.overlap(this.computer,computerCollide); 

	}
}

class BobRoom extends PNGRoom {
	load() {
		super.load()
     //creat AC controler sprite for collison
      this.controler = createSprite(800, 533, 84, 15);
      this.controler.addAnimation('controler', loadAnimation('assets/Controler.png'));

      //create Bob NPC sprite
      this.bobNPC = createSprite(1066, 310, 44, 132);
      this.bobNPC.addAnimation('bob', loadAnimation('assets/bob.png'));
		//check if AC task is completed 
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

	load() {
		//superclass 
		super.load();
    //recycle bin sprite for collison
    this.recycle = createSprite(840, 210, 67, 97);
    this.recycle.addAnimation('recycle', loadAnimation('assets/Recycle.png'));
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
	load() {
		//superclass 
		super.load();
    //recycle bin sprite for collison
    this.landfill = createSprite(840, 210, 67, 97);
    this.landfill.addAnimation('landfill', loadAnimation('assets/Landfill.png'));
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
class FrontYardWatered extends PNGRoom {
  load() {
    //superclass
    super.load(); 
    if (water && trash && checkBob) {
      earthText = "Let's go outside to see if anyone needs help.";
    }
    else {
      earthText = "Finished watering the yard. Let's go back inside to finish the other chores.";
    }
  }
  unload() {
    super.unload()
    earthText = " ";
  }
}

class MirrorClean extends PNGRoom {
	draw () {
		//check dirty level and change state of the mirror appropriately
		super.draw();
    print("dirty:"+dirtyLevel);
		if (dirtyLevel ==0 ) {
  			adventureManager.changeState("MirrorClean");
  		}
  		else if (dirtyLevel ==1 ) {
  			adventureManager.changeState("MirrorDirty1");
  		}
      else if (dirtyLevel ==2 ) {
        adventureManager.changeState("MirrorDirty2");
      }
      else if (dirtyLevel ==3 ) {
        adventureManager.changeState("MirrorDirty3");
      }
  		else {
  			adventureManager.changeState("MirrorDirty4");
  		}
	}
}
class Outside extends PNGRoom {
  load() {
    super.load();
    //house sprite
    this.house = createSprite(610,65,216,151);
    this.house.addAnimation('house', loadAnimation('assets/House.png'));
    //when user goes out without finishing the home tasks 
    if (water==false || trash==false || checkBob==false) {
      earthText = "I think I should go back in to first finish the chores that mom told me to do in the house.";
    }
    //lead user to visit MrBeach first
    else if (visitMrBeach ==false) {
      earthText = "Let's visit Mr.Beach! Now that I think about it Mr.Beach kinda looks like Bob with a hat and a mustache. hmmmmm";
    }
  }
  unload() {
    super.unload();
    earthText =" ";
  }
  draw() {
    super.draw();
    //draw house
    drawSprite(this.house);
    playerSprite.overlap(this.house,houseCollide);  
  }
}

class MarketOutside extends PNGRoom {
  load() {
    super.load();
    //market sprite 
    this.market = createSprite(700,420,280,267);
    this.market.addAnimation('market', loadAnimation('assets/Market.png'));
    if (marketTask ==false) {
      earthText = "Let's go inside the market";
    }
    else {
      earthText = "Let's give this back to Ms.Sweet.";
    }
  }
  unload() {
    super.unload();
    earthText =" ";
  }
  draw() {
    super.draw();
    //draw market
    drawSprite(this.market);
    playerSprite.overlap(this.market,marketCollide);  
  }
}

class MrBeachHouse extends PNGRoom {
  load() {
    super.load();
    //Mr.Beach sprite
    this.beachNPC = createSprite(700,425,47,121);
    this.beachNPC.addAnimation('mr.beach', loadAnimation('assets/Mr.Beach.png'));

    //add Mr.Beach image
    beachImage = loadImage('assets/Mr.beachImage.png');
  }
  unload() {
    super.unload();
    earthText =" ";
    talkImage = null;
  }
  draw() {
    super.draw();
    //check if state should change to the Watered state
    if (giveBack == true && dirtyLevel == 4) {
      adventureManager.changeState("Mr.BeachHouseWater");
      earthText = "Oh no! Mr.Beach's house is underwater because of the rising sea level.";
      checkUp = true;
    }
    //draw NPC
    drawSprite(this.beachNPC);
    playerSprite.overlap(this.beachNPC,talkBeach); 
  }
}

class MsSweetHouse extends PNGRoom {
  load() {
    super.load();
    //Ms.Sweet sprite
    this.sweetNPC = createSprite(640,201,47,121);
    this.sweetNPC.addAnimation('ms.sweet', loadAnimation('assets/Ms.Sweet.png'));
    //creat transparent door sprite for bottom collison
    this.door = createSprite(600, 540, 145, 20);
    this.door.addAnimation('door', loadAnimation('assets/TransparentDoor.png'));

    //add Ms.Sweet image
    sweetImage = loadImage('assets/Ms.SweetImage.png');
  }
  unload() {
    super.unload();
    earthText =" ";
    talkImage = null;
  }
  draw() {
    super.draw();
    //turn clickables off
    clickables[22].visible = false;
    clickables[23].visible = false;
    //draw Ms.Sweet
    drawSprite(this.sweetNPC);
    playerSprite.overlap(this.sweetNPC,talkSweet);  
    //draw door sprite
    drawSprite(this.door);
    //check for overlap with door and main character and switch to next state when collided
    playerSprite.overlap(this.door,doorCollide);

  }
}
class Cross extends PNGRoom {
  load() {
    super.load();
    //after visiting Mr.Beach, accept task from Ms.Sweet 
    if (visitMrBeach == true && visitMsSweet == false) {
      earthText = "Now let's visit Ms.Sweet if she needs any help.";
    }
    //after comeing out of the Mr.BeachHouseWatered state
    else if (checkUp == true) {
      earthText = "I feel bad for Mr.Beach. I should have kept myself clean. I think I should go home now.";
    }
    //lead user to Mr.BeachHouseWatered state
    else if (giveBack==true && dirtyLevel == 4) {
      earthText = "I feel really dirty and feel as if I lost some land... Let's check up on Mr.Beach once more to see if he is fine."
    }
    // go home for ending
    else if (giveBack == true && dirtyLevel<4) {
      earthText = "I think I am done with helping everyone. I should go home now and wait for mom to come back.";
    }
    // go to market to finish task
    else if (marketTask == false && visitMsSweet == true) {
      earthText = "Let's go to the market to get Ms.Sweet some protein. But now that I think about it she too kinda looks like Bob.";
    }

    //creat transparent door sprite for top collison
    this.door = createSprite(600, 0, 145, 20);
    this.door.addAnimation('door', loadAnimation('assets/TransparentDoor.png'));
  }
  unload() {
    super.unload();
    earthText =" ";
  }
  draw() {
    super.draw();
    drawSprite(this.door);
    //check for overlap with door and main character and switch to next state when collided
    playerSprite.overlap(this.door,doorCollide2);
  }
}
class MarketInside extends PNGRoom {
  load() {
    super.load();
    //Shop Owner sprite
    this.shopOwnerNPC =createSprite(260,95,47,121);
    this.shopOwnerNPC.addAnimation('shopOwner', loadAnimation('assets/ShopOwner.png'));
    //meat sprite
    this.meat = createSprite(600,50,70,70);
    this.meat.addAnimation('meat',loadAnimation('assets/Meat.png'));
    //egg sprite
    this.egg = createSprite(750,50,70,70);
    this.egg.addAnimation('egg',loadAnimation('assets/Egg.png'));
    //market door sprite
    this.marketDoor = createSprite(20,220,16,145);
    this.marketDoor.addAnimation('marketDoor',loadAnimation('assets/MarketDoor.png'));

    shopOwnerImage = loadImage('assets/ShopOwnerImage.png');

    earthText = "I guess I can choose between Meat or Eggs and bring it over to the shop owner. But the shop owner kinda looks like Mr.Beach. Everyone here kinda looks alike."
  }
  unload() {
    super.unload();
    earthText =" ";
    talkImage = null;
  }
  draw() {
    super.draw();
    //draw meat sprite
    drawSprite(this.meat);
    //check for overlap with door and main character and switch to next state when collided
    playerSprite.overlap(this.meat,meatCollide);

    //draw egg sprite
    drawSprite(this.egg);
    //check for overlap with door and main character and switch to next state when collided
    playerSprite.overlap(this.egg,eggCollide);

    //draw shopOwner NPC
    drawSprite(this.shopOwnerNPC);
    playerSprite.overlap(this.shopOwnerNPC,talkShopOwner);  

    //draw market door
    drawSprite(this.marketDoor);
    playerSprite.overlap(this.marketDoor,marketDoorCollide);  
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
			earthText = "Time to go to Bob's room! Hope Bob isn't doing anything bad...";
		}
		else {
			earthText = "Now let's go outside to see if any of our neighbor needs any help.";
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