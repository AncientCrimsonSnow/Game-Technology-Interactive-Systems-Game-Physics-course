//****** Canvas bezogene  Variablen ******/

//half width of default canvas(1200mm)
var canvas;
const canvasID = 'main';
const hw = 1200/2;
//width and height for Canvas
var w =  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

//****** auf die gezeichneten Objekte bezogene Variablen ******/

//*** Dreiecke ***/
//cathete of BigTriangles
const bigCathete = 50;
//cathete of SmallTriangles
const smallCathete = 32;
//height of the BigTriangles
const bigH = Math.sqrt(bigCathete*bigCathete - (bigCathete/2)*(bigCathete/2));
//height of the SmallTrianles
const smallH = Math.sqrt(smallCathete*smallCathete - (smallCathete/2)*(smallCathete/2));

//*** Rampen(Pads) ***/
//pad width and height
const Pad_w = 250;
const Pad_h = 5

//*** Bälle ***/
//radius of balls
const radius = 16;

//****** auf die UI Objekte bezogene Variablen ******/

//startbutton width and height
const startbutton_w = 190;
const startbutton_h = 70;
//border from Bottemright of the Startbutton
const startButton_border = 10;

//****** sonstiges ******/
//Radius of big Touchable Circles
const radiusArea = 30;
var areas = []; 				  		  //Array with all areas we use:

//****** auf die Eigenschaften bezogene Variablen ******/

//default angles
const angle_R_default = -20;
const angle_L_default = 20;
//the angles of the Left and right pad:
var angle_R, angle_L;
//g-force (not 9.81 its 10) often gamedevs do it like this to safe memory
const g = 100 * 10;
//frictionvalue
const muR = 0.1;
//if we reposition the ball at each transition, we lose a bit force in x dir. this way we can get it mostly back
const setCorrection = 1.001;
//Airtightness in g/mms
const rho = 1.3;
//cw value of ball
const cw = 0.45;
//mass of ball
const mBall = 2.5;
//Zeitkonstante nach Newton
const tau = mBall/(rho*cw*Math.PI*Math.pow(radius/1000,2));
//if we have friction
const friction = true;
//ob die Kollision eine Zwangsbedingung hat
const ebene = true;

var xi0, yi0;                     // kartesischer Mittelpunkt im internen Koordinatensystem
var M;                            // Maßstab 
var t;                        // Zeit
var dt;                           // Zeitquant - wird auf die Bildwechselrate bezogen 
var frmRate;                      // Fliesskommadarstellung für Kehrwertbildung notwendig!

//****** sonstiges ******/

//StartmenuScene
var Scene0;
//GameScene
var Scene1;
//TestScene
var Scene2;

//The vector we use to move the 2 playerBalls
var Vector_Move = new MyVector2D(0,0);
//The vector we use to move the middle Balll
var vMid = new MyVector2D(0,0);
//mode in which our game is
var mode;
//which players turn 0 = both can act, 1 = player_L can act, 2= player_R can act
var playersTurn = 0;

//score of each player;
var score_Player_L = 0;
var score_Player_R = 0;
//if the Balls are moving
var startedMove = false;

//Movementvectors for our Testscene.
var test_v1;
var test_v2;


//if we allow collisions to happen;
var collisionPossible = true;
//Threshold between 2 collisions (in seconds)
var collisionThreshhold = 1;
//Array with all colliders we use:
var lineColliders = [];
//Collider of left and right pads
var pad_L_Collider, pad_R_Collider;
//left of right transition of the flat movement to the pad movement
var transition_R, transition_L;
//the mode of the last frame
var lastframeMode;

//Positionen, welche beim festlegen einer Startposition, nach dem Wechsel eines Modus, nötig sind
const Uniform = {
	"balls" : {
		"ball_R" : {
			"default": new MyPoint(hw + 0.3*Pad_w + radius + 5, -radius -bigH -Pad_h)
		},
		"ball_L" : {
			"default": new MyPoint(-hw - 0.3*Pad_w - radius - 5, -radius -bigH -Pad_h)
		}
	}
}
//Aussehen
var Appearances = {
	"ball" : new Appearance('#fe7f5f', false, true),
	"d_R" : new Appearance('#5b9bd5', false, true),
	"d_L" : new Appearance('#5b9bd5', false, true),
	"pad_R" : new Appearance('#5b9bd5', false, true),
	"pad_L" : new Appearance('#5b9bd5', false, true),
	"sd_R" : new Appearance('#5b9bd5', false, true),
	"sd_L" : new Appearance('#5b9bd5', false, true),
	"tl_R" : new Appearance('#ff0000', false, true),
	"tl_L" : new Appearance('#ff0000', false, true),
	"ball_R" : new Appearance('#0000ff', false, true),
	"ball_L" : new Appearance('#ff0000', false, true),
	"startButton": new Appearance('#ffffff', true, true, true),
	"touchArea_R": new Appearance('#ffffff', false, false),
	"touchArea_L": new Appearance('#ffffff', false, false),
	"pad_R_collider" : new Appearance('#000000', true, true),
	"pad_L_collider" : new Appearance('#000000', true, true),
	"menuScene1" : new Appearance('#5b9bd5', false, true, true),
	"menuScene2" : new Appearance('#5b9bd5', false, true, true),
	"backToScene0" : new Appearance('#5b9bd5', false, true, true),
	"testBall1" : new Appearance('#ff0000', true, true),
	"testBall2" : new Appearance('#0000ff', true, true)
}
let p//Punktearrays
var Points = {
	"ball" :[
		new MyPoint(0,-radius)
		],
	"d_R" : [
		new MyPoint(hw - bigCathete/2, 0),
		new MyPoint(hw + bigCathete/2, 0),
		new MyPoint(hw, -bigH)
		],
	"d_L" : [
		new MyPoint(-hw + bigCathete/2, 0),
		new MyPoint(-hw - bigCathete/2, 0),
		new MyPoint(-hw, -bigH)
		],
	"pad_R":[
		new MyPoint(hw-Pad_w/2, -bigH-Pad_h),
		new MyPoint(hw+Pad_w/2, -bigH)
		],
	"pad_L":[
		new MyPoint(-hw - Pad_w/2, -bigH-Pad_h),
		new MyPoint(-hw + Pad_w/2, -bigH)
		],
	"sd_R" :[
		new MyPoint(hw + 0.3*Pad_w - smallCathete/2, -bigH),
		new MyPoint(hw + 0.3*Pad_w + smallCathete/2, -bigH),
		new MyPoint(hw + 0.3*Pad_w, -(smallH + bigH))
		],
	"sd_L" :[
		new MyPoint(-hw - 0.3*Pad_w - smallCathete/2, -bigH),
		new MyPoint(-hw - 0.3*Pad_w + smallCathete/2, -bigH),
		new MyPoint(-hw - 0.3*Pad_w, -(smallH + bigH))
		],
	"tl_R" :[
		new MyPoint(420, 0),
		new MyPoint(450, -5)
		],
	"tl_L" :[
		new MyPoint(-450, 0),
		new MyPoint(-420, -5)
		],
	"ball_R": [
		new MyPoint(hw + 0.3*Pad_w + radius + 5, -radius -bigH -Pad_h)
		],
	"ball_L": [
		new MyPoint(-hw - 0.3*Pad_w - radius - 5, -radius -bigH -Pad_h)
	],
	"startButton":[
		new MyPoint(w - startButton_border - startbutton_w, h - startButton_border - startbutton_h),
		new MyPoint(w - startButton_border, h - startButton_border)
		],
	"touchArea_R":[
		new MyPoint(hw+Pad_w/2, -bigH-Pad_h)
	],
	"touchArea_L":[
		new MyPoint(-hw - Pad_w/2, -bigH-Pad_h)
	],
	"pad_R_collider" : [
		getCirclePoint(
			new MyPoint(hw, -bigH - Pad_h), angle_R_default, Pad_w/2),
		getCirclePoint(
			new MyPoint(hw, -bigH - Pad_h), angle_R_default, -Pad_w/2)
	],
	"pad_L_collider" : [
		getCirclePoint(
			new MyPoint(-hw, -bigH - Pad_h), angle_L_default, Pad_w/2),
		getCirclePoint(
			new MyPoint(-hw, -bigH - Pad_h), angle_L_default, -Pad_w/2)
	],
	"menuScene1" : [
		new MyPoint(200, 200),
		new MyPoint(400, 260)
	],
	"menuScene2" : [
		new MyPoint(200, 300),
		new MyPoint(400, 360)
	],
	"backToScene0" : [
		new MyPoint(50, 100),
		new MyPoint(150, 130)
	],
	"testBall1" : [
		new MyPoint(-100, -radiusArea)
	],
	"testBall2" : [
		new MyPoint(100, -radiusArea)
	],
	"testball1_vx_input" : [
		new MyPoint(0,0)
	],
	"testball1_vy_input" : [
		new MyPoint(100,-100)
	],
	"testball2_vx_input" : [
		new MyPoint(200,-200)
	],
	"testball2_vy_input" : [
		new MyPoint(300,-300)
	],
}
//verschiedene Formen
var Shapes = {
	"ball" : new MyEllipse(Points.ball, radius, Appearances.ball, mBall),
	"d_R" : new MyTriangle(Points.d_R, Appearances.d_R),
	"d_L" : new MyTriangle(Points.d_L, Appearances.d_L),
	"pad_R" : new MyRect(Points.pad_R, Appearances.pad_R),
	"pad_L" : new MyRect(Points.pad_L, Appearances.pad_L),
	"sd_R" : new MyTriangle(Points.sd_R, Appearances.sd_R),
	"sd_L" : new MyTriangle(Points.sd_L, Appearances.sd_L),
	"tl_R" : new MyRect(Points.tl_R, Appearances.tl_R),
	"tl_L" : new MyRect(Points.tl_L, Appearances.tl_L),
	"ball_R" : new MyEllipse(Points.ball_R ,radius, Appearances.ball_R, mBall),
	"ball_L" : new MyEllipse(Points.ball_L ,radius, Appearances.ball_L, mBall),
	"startButton" :  new MyRect(Points.startButton, Appearances.startButton),
	"touchArea_R": new MyEllipse(Points.touchArea_R, radiusArea, Appearances.touchArea_R),
	"touchArea_L": new MyEllipse(Points.touchArea_L, radiusArea, Appearances.touchArea_L),
	"pad_R_collider" : new MyLine(Points.pad_R_collider, Appearances.pad_R_collider),
	"pad_L_collider" : new MyLine(Points.pad_L_collider, Appearances.pad_L_collider),
	"menuScene1" : new MyRect(Points.menuScene1, Appearances.menuScene1),
	"menuScene2" : new MyRect(Points.menuScene2, Appearances.menuScene2),
	"backToScene0" : new MyRect(Points.backToScene0, Appearances.backToScene0),
	"testBall1" : new MyEllipse(Points.testBall1, radiusArea, Appearances.testBall1, mBall),
	"testBall2" : new MyEllipse(Points.testBall2, radiusArea, Appearances.testBall2, mBall)
}
//Sammlung von Funktionen, welche in Actionen genutzt werden
var Functions = {
	"startButton" : 
		function(area){
			if(area.myText === Texts.startButton["0"]){
				area.setText(Texts.startButton["1"]);
				mode = 2;
			}
			else{
				area.setText(Texts.startButton["0"]);
				mode = 1;
			}
	},
	"touchArea_R" : {
		0: 
			function (area) {
				if(playersTurn == 2 || playersTurn == 0){
					const kat_mouseP = getMousePoint(true);
					const kat_mouse_degree = degree(Shapes.d_R.points[2], kat_mouseP);
					angle_R = limit(kat_mouse_degree, angle_L_default, angle_R_default);
				}
			},
		1: 
			function (area) {
				if(playersTurn == 2 || playersTurn == 0){
					mode = 3;
				}
			}
	},
	"touchArea_L" : {
		0:
			function(area) {
				if(playersTurn == 1 || playersTurn == 0){
					const kat_mouseP = getMousePoint(true);
					let kat_mouse_degree = degree(Shapes.d_L.points[2], kat_mouseP) - 180;
					if(kat_mouse_degree > 180){
						kat_mouse_degree = kat_mouse_degree-360;
					}
					if(kat_mouse_degree < -180)
						kat_mouse_degree += 360;
					angle_L = limit(kat_mouse_degree, angle_L_default, angle_R_default);
				}
			},
		1:
			function(area) {
				if(playersTurn == 1 || playersTurn == 0){
					mode = 4;
				}
			}
	},
	"menuScene1" : function (){
		changeScene(Scene1);
	},
	"menuScene2" : function (){
		changeScene(Scene2);
	},
	"backToScene0" : function (){
		changeScene(Scene0);
	},
	"testBall1" : function (){
		mode = 2;
	},
	"testBall2" : function (){
		mode = 3;
	},
	"testBall" : {
		0:
			function (area) {
				const kat_mouseP = getMousePoint(true);
				area.shape.myPosition(kat_mouseP);
			},
		1:
			function () {
				mode = 1;
			}
	},
	"test_startButton" :
		function(area){
			if(area.myText === Texts.startButton["0"]){
				area.setText(Texts.startButton["1"]);
				mode = 4;
			}
			else{
				area.setText(Texts.startButton["0"]);
				Areas.testBall1.shape.myPosition(new MyPoint(-100, -radiusArea));
				Areas.testBall2.shape.myPosition(new MyPoint(100, -radiusArea));
				mode = 1;
			}
		},
}
//Arrays von Actionen welche Areas hinzugefügt werden
var Actions = {
	"startButton" : [
		new MyAction(Functions.startButton, "release", 0)
	],
	"touchArea_R" : [
		new MyAction(Functions.touchArea_R["0"], "drag", 2),
		new MyAction(Functions.touchArea_R["1"], "release", 2)
	],
	"touchArea_L" : [
		new MyAction(Functions.touchArea_L["0"], "drag", 2),
		new MyAction(Functions.touchArea_L["1"], "release", 2)
	],
	"menuScene1" : [
		new MyAction(Functions.menuScene1, "release", 0)
	],
	"menuScene2" : [
		new MyAction(Functions.menuScene2, "release", 0)
	],
	"backToScene0" : [
		new MyAction(Functions.backToScene0, "release", 0)
	],
	"testBall1" : [
		new MyAction(Functions.testBall1, "pressed", 1),
		new MyAction(Functions.testBall["0"], "drag", 2),
		new MyAction(Functions.testBall["1"], "release", 2),
	],
	"testBall2" : [
		new MyAction(Functions.testBall2, "pressed", 1),
		new MyAction(Functions.testBall["0"], "drag", 3),
		new MyAction(Functions.testBall["1"], "release", 3),
	],
	"test_startButton" : [
		new MyAction(Functions.test_startButton, "release", 0)
	],
}
//Sammlung von Texten
var Texts = {
	"noText" : "",
	"startButton" : {
		0 : "START",
		1 : "RESET"
	},
	"menuScene1" : "Spiel",
	"menuScene2" : "Test",
	"backToScene0" : "Menu",
	"testBall1" : "1",
	"testBall2" : "2",
	"testball1_vx_input" : "Ball_1_vx",
	"testball1_vy_input" : "Ball_1_vy",
	"testball2_vx_input" : "Ball_2_vx",
	"testball2_vy_input" : "Ball_2_vy"
}
//Sammlung von Areas
var Areas = {
	"startButton" : new MyArea(Shapes.startButton, Texts.startButton["0"], Actions.startButton,1),
	"touchArea_R" : new MyArea(Shapes.touchArea_R, Texts.noText, Actions.touchArea_R,1),
	"touchArea_L" : new MyArea(Shapes.touchArea_L, Texts.noText, Actions.touchArea_L,1),
	"backToScene0_1" : new MyArea(Shapes.backToScene0, Texts.backToScene0, Actions.backToScene0,1),
	"backToScene0_2" : new MyArea(Shapes.backToScene0, Texts.backToScene0, Actions.backToScene0,2),
	"menuScene1" : new MyArea(Shapes.menuScene1, Texts.menuScene1, Actions.menuScene1,0),
	"menuScene2" : new MyArea(Shapes.menuScene2, Texts.menuScene2, Actions.menuScene2,0),
	"testBall1" : new MyArea(Shapes.testBall1, Texts.testBall1, Actions.testBall1,2),
	"testBall2" : new MyArea(Shapes.testBall2, Texts.testBall2, Actions.testBall2,2),
	"test_startButton" : new MyArea(Shapes.startButton, Texts.startButton["0"], Actions.test_startButton,2),
}
//Sammlung der 2 Collider
var Colliders = {
	pad_R : new LineCollider(Shapes.pad_R_collider),
	pad_L : new LineCollider(Shapes.pad_L_collider),
}
//Sammlung aller Inputfields für die Testscene
var InputFields = {
	"testball1_vx_input" : new MyInput(Points.testball1_vx_input, Texts.testball1_vx_input),
	"testball1_vy_input" : new MyInput(Points.testball1_vy_input, Texts.testball1_vy_input),
	"testball2_vx_input" : new MyInput(Points.testball2_vx_input, Texts.testball2_vx_input),
	"testball2_vy_input" : new MyInput(Points.testball2_vy_input, Texts.testball2_vy_input),
}
//Die 2 roten Ziele des Spiels
var Goals = {
	"goal_L" : new Goal(Shapes.tl_L, "player_L"),
	"goal_R" : new Goal(Shapes.tl_R, "player_R"),
}