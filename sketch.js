/***********************************************************************************
  Project2
  by Ashley Lee

  Use the p5.play.js library to create an earth character that waves. 

------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.play.js"></script>
***********************************************************************************/

//create character variable
var character;

//load the images
function preload(){
	//preload the animation png in the character varaible
	character = loadAnimation('assets/earth_wave001.png','assets/earth_wave002.png','assets/earth_wave003.png',
		'assets/earth_wave004.png', 'assets/earth_wave005.png', 'assets/earth_wave006.png','assets/earth_wave007.png',
		'assets/earth_wave008.png', 'assets/earth_wave009.png', 'assets/earth_wave010.png', 'assets/earth_wave011.png',
		'assets/earth_wave012.png', 'assets/earth_wave013.png', 'assets/earth_wave014.png', 'assets/earth_wave015.png')
}
// Setup code 
function setup() {
  createCanvas(600, 400);
 }

function draw() {
  background(0);
  //draw the animation in the middle of the canvas
  animation(character, 300,200);
}