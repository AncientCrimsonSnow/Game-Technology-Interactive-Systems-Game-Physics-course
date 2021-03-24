class MyPoint{
	/**
	 * A 2D Point:
	 *
	 * @param {number} x x-value.
	 * @param {number} y y-value.
	 */
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	/**
	 * normalized to the base system and converting back from the Cartesian coordinate system.
	 */
	normalize(){
		this.x += xi0;
		this.y += yi0;
	}
	/**
	 * Move this point.
	 *
	 * @param {MyVector2D} v the vector we use to move our point.
	 */
	myTranslate(v){
		this.x += v.x;
		this.y += v.y;		
	}
	/**
	 * Position this point.
	 *
	 * @param {MyPoint} p position this point to the param point
	 */
	myPosition(p){
		this.x = p.x;
		this.y = p.y;
	}
	/**
	 * get the difference between 2 points
	 *
	 * @param {MyPoint} p other point
	 * @return {MyVector2D} difference between 2 points
	 */
	getDifference(p){
		return new MyVector2D(p.x - this.x, p.y - this.y);
	}
}
class MyVector2D{
	/**
	 * A 2D Vector:
	 *
	 * @param {number} x x-value.
	 * @param {number} y y-value.
	 */
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	/**
	 * calculate the cross-product.
	 *
	 * @param {MyVector2D} v other vector we calculate with
	 * @return {number} cross product
	 */
	cross_product(v){
		return this.x * v.y - v.x * this.y;
	}
	/**
	 * gives us the value of this vector
	 *
	 * @return {number} value of this vector
	 */
	value(){
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	/**
	 * normaly a Vector x and y represent the change in one sec. To use them nicely we reduce the x and y to that it represents a frame.
	 *
	 * @return {MyVector2D} framed Vector2d
	 */
	frame(){
		return new MyVector2D(this.x*dt, this.y*dt);
	}
	/**
	 * rotate this vetor and return the reseult in a new one
	 *
	 * @param {number} angle we want to rotate around
	 * @return {MyVector2D} rotated Vector
	 */
	rotate(angle){
		return new MyVector2D(
			this.x * cos(angle) - this.y * sin(angle),
			this.x * sin(angle) + this.y * cos(angle))
	}
}
class MyShape{
	/**
	 * A superclass which handles some Functions and data for subclasses
	 *
	 * @param {Array.<MyPoint>} points all points we need for a shape
	 * @param {Appearance} appearance if we want to draw it, here its saved how we want it
	 */
	constructor(points, appearance){
		this.points = points;
		this.appearance = appearance;
	}
	//normalize this shape
	normalize(){
		this.normalized = true;
		for(let i = 0; i< this.points.length; i++)
			this.points[i].normalize();
	}
	/**
	 * Move this Shape by a Vector
	 *
	 * @param {MyVector2D} v Vector we want to move it
	 */
	myTranslate(v){
		for(let i = 0; i< this.points.length; i++)
			this.points[i].myTranslate(v);
	}
	/**
	 * Position this Shape to a Point, the anchor point is the first position in the Array
	 *
	 * @param {MyPoint} p Position to which we want to move.
	 */
	myPosition(p){
		let distance = this.points[0].getDifference(p);
		this.points[0].myPosition(p);
		for(let i = 1; i < this.points.length; i++)
			this.points[i].myTranslate(distance);
	}
}
class Appearance{
	/**
	 * Here we can save data, which we need to draw things in p5
	 *
	 * @param {string} color hexa-code of the Color
	 * @param {boolean} stroke if we want a stroke
	 * @param {boolean} fill if we want to fill
	 * @param {boolean} normalized if apprearance is noramlized
	 */
	constructor(color, stroke, fill, normalized){
		this.color = color;
		this.stroke = stroke;
		this.fill = fill
		this.normalized = false;
		if(normalized)
			this.normalized = normalized;
	}
	/**
	 * Need to be called before we want to draw a thing to set the drawing-settings
	 */
	setDrawMode(){
		fill(this.color);
		if(this.stroke){
			stroke(1);
		}
		else{
			noStroke();
		}
		if(!this.fill){
			noFill();
		}
		let i = 1
		if(this.normalized) 
			i = 1/M;
		return i;
	}
}

class MyTriangle extends MyShape{
	/**
	 * A Triangle
	 *
	 * @param {Array.<MyPoint>} points all points we need for a shape
	 * @param {Appearance} appearance if we want to draw it, here its saved how we want it
	 */
	constructor(points, appearance){
		super(points, appearance);
		this.name = "triangle";
	}
	/**
	 * draw the Triangle
	 *
	 * @param {number} angle the angle in which we want to draw
	 * @param {MyPoint} p the point we want to rotate around
	 */
	draw(angle, p){
		const p0 = this.points[0];
		const p1= this.points[1];
		const p2 = this.points[2];
		let i = this.appearance.setDrawMode();
		if(!angle){
			triangle(p0.x*M*i, p0.y*M*i, p1.x*M*i, p1.y*M*i, p2.x*M*i, p2.y*M*i);
		}
		else{
			myRotate(angle, p)
			triangle((p0.x-p.x)*M*i,(p0.y-p.y)*M*i,(p1.x-p.x)*M*i,(p1.y-p.y)*M*i,(p2.x-p.x)*M*i,(p2.y-p.y)*M*i);
			pop();
		}
	}
}
class MyRect extends MyShape{
	/**
	 * A Rectangle, the first must be the uper left one, second point stretch the Rectangle
	 * @param {Array.<MyPoint>} points all points we need for a shape
	 * @param {Appearance} appearance if we want to draw it, here its saved how we want it
	 */
	constructor(points, appearance){
		super(points, appearance);
		this.name = "rect";
		this.w = Math.abs(this.points[0].x-this.points[1].x);
		this.h = Math.abs(this.points[0].y-this.points[1].y);
	}
	/**
	 * draw the Rectangle
	 *
	 * @param {number} angle the angle in which we want to draw
	 * @param {MyPoint} p the point we want to rotate around
	 */
	draw(angle, p){
		const p0 = this.points[0];
		let i = this.appearance.setDrawMode();
		if(!angle){
			rect(p0.x*M*i, p0.y*M*i, this.w*M*i, this.h*M*i)
		}
		else{
			myRotate(angle, p)
			rect((p0.x-p.x)*M*i,(p0.y-p.y)*M*i, this.w*M*i, this.h*M*i);
			pop();
		}
	}
}
class MyEllipse extends MyShape{
	/**
	 * A Ellipse
	 *
	 * @param {Array.<MyPoint>} points all points we need for a shape
	 * @param {number} radius the radius of the ellipse.
	 * @param {Appearance} appearance if we want to draw it, here its saved how we want it
	 * @param {number} mass of the Ellipse
	 */
	constructor(points, radius, appearance, mass){
		super(points, appearance);
		this.name = "ellipse";
		this.radius = radius;
		if(mass){
			this.mass = mass;
		}
	}
	/**
	 * draw the Ellipse
	 *
	 * @param {number} angle the angle in which we want to draw
	 * @param {MyPoint} p the point we want to rotate around
	 */
	draw(angle, p){
		let i = this.appearance.setDrawMode();
		if(!angle){
			ellipse(this.points[0].x*M*i, this.points[0].y*M*i, this.radius*2*M*i, this.radius*2*M*i);
		}
		else{
			myRotate(angle, p)
			ellipse((this.points[0].x-p.x)*M*i, (this.points[0].y-p.y)*M*i, this.radius*2*M*i, this.radius*2*M*i);
			pop();
		}
	}
	getY(){
		return this.points[0].y;
	}
	getX(){
		return this.points[0].x;
	}
}
class MyArea{
	/**
	 * A Area, in a specific shape. You can click on it to perform actions.
	 * Also in the constructor we put a initialized are into an array which we need later
	 *
	 * @param {shape} shape the shape u can click on.
	 * @param {String} myText the text that u can display in the shape.
	 * @param {Array.<MyAction>} actions the function that will be used when the shape got clicked.
	 * @param {number} sceneNr the number of the Scene in which we use this Area.
	 */
	constructor(shape, myText, actions, sceneNr){
		this.shape = shape;
		this.myText = myText;
		this.actions = actions;
		this.sceneNr = sceneNr;
		areas.push(this);
	}
	/**
	 * Checks if the mouse is in that area
	 *
	 * @return {boolean} true if mouse if over this area
	 */
	checkMouse(){
		switch(this.shape.name){
		case "rect":
			if(mouseX >= this.shape.points[0].x && mouseX <= this.shape.points[1].x){
				if(mouseY >= this.shape.points[0].y && mouseY <= this.shape.points[1].y){
					return true;
				}
			}
			return false;
		case "ellipse":
			const normCenter = new MyPoint(this.shape.points[0].x*M, this.shape.points[0].y*M);
			normCenter.normalize();
			const radiusSq = this.shape.radius*this.shape.radius;
			const distanceSq = (normCenter.x - mouseX) * (normCenter.x - mouseX) + (normCenter.y - mouseY) * (normCenter.y - mouseY);
			return distanceSq <= radiusSq;
		default:
		}	
	}
	//update the Text
	setText(myText){
		if(myText){
			this.myText = myText;
		}
		fill(0);
		textAlign(CENTER, CENTER);
		switch(this.shape.name){
		case "rect":
			textSize(this.shape.h*0.8);
			const m = getMidPoint(this.shape.points[0], this.shape.points[1])
			text(this.myText, m.x, m.y);
			break;
		case "ellipse":
			textSize(this.shape.radius*1);
			text(this.myText, this.shape.points[0].x*M, this.shape.points[0].y*M);
			break;
		default:
		}
	}
}
class MyAction{
	/**
	 * A MyAction holds a callable function
	 *
	 * @param {Object} the function we call in this MyAction
	 * @param {string} mouseMode a mousemode can be "drag" or "release" if tells u how to activate a MyAction in an Area
	 * @param {number} mode Our Games works in different Modes. To Hardcap MyActions a MyAction can only be usable in one mode. Exception is Mode = 0, MyAction in mode 0 can be used in all modes
	 */
	constructor(action, mouseMode, mode){
		this.action = action;
		this.mouseMode = mouseMode;
		this.mode	= mode;
	}
}
class MyLine extends MyShape{
	/**
	 * A MyLine is also a 1d Shape
	 *
	 * @param {Array.<MyPoint>} points all points we need for a shape
	 * @param {Appearance} appearance if we want to draw it, here its saved how we want it
	 */
	constructor(points, appearance){
		super(points, appearance);
		this.name = "line";
	}
	/**
	 * Calculate the distance between this line and a point
	 *
	 * @param {MyPoint} p Point we need to get the disctance to
	 * @return {number} the distance
	 */
	distance(p){
		let A = p.x - this.points[0].x;
		let B = p.y - this.points[0].y;
		let C = this.points[1].x -  this.points[0].x;
		let D = this.points[1].y -  this.points[0].y;

		let dot = A * C + B * D;
		let len_sq = C * C + D * D;
		let param = -1;
		if(len_sq != 0)
			param = dot/len_sq;

		let xx, yy;

		if(param < 0){
			xx = this.points[0].x;
			yy = this.points[0].y;
		}
		else if(param > 1){
			xx = this.points[1].x;
			yy = this.points[1].y;
		}
		else{
			xx = this.points[0].x + param * C;
    		yy = this.points[0].y + param * D;
		}
		let dx = p.x - xx;
		let dy = p.y -yy;

		return Math.sqrt(dx * dx + dy * dy);
	}
	/**
	 * Calculate the x coordinate in which y and a specific distance we cross our line
	 *
	 * @param {number} distance the distance
	 * @param {number} y-Coordinates in which we cross our Line
	 * @return {number} x-coordinate
	 */
	reverseDistanceX(distance, y){
		let dy = this.points[1].y - this.points[0].y
		let dx = this.points[1].x - this.points[0].x
		let m = dy/dx;
		let alpha = Math.atan(m) * 180/PI;
		let b1 = distance/Math.cos(alpha*PI/180);
		let b = this.points[0].y - m * this.points[0].x - b1;
		return (y - b)/m;
	}
	/**
	 * Calculate the collision-point. If a Ball hits our Line, we want to have the coordinates of the Ball where it has stopped
	 *
	 * @param {number} distance the distance from the line where the ball has to stop
	 * @param {MyEllipse} ball the Ball who is about to collide with the Line
	 * @param {MyVector2D} v the moveVector of the ball.
	 * @return {MyPoint} Point where the ball has to stop
	 */
	getCollisionPoint(distance, ball, v){
		let g0 = new lineareFunction(
			new MyPoint(this.points[0].x, this.points[0].y),
			new MyPoint(this.points[1].x, this.points[1].y));
		let alpha = Math.atan(g0.m) * 180/PI;
		let b1 = distance/Math.cos(alpha*PI/180);
		g0.myTranslate(new MyVector2D(0,-b1));
		let p0 = new MyPoint(ball.points[0].x, ball.points[0].y);
		let p1 = new MyPoint(p0.x + v.x, p0.y + v.y);

		let g1 = new lineareFunction(p0, p1);
		
		return g0.getInterception(g1);
	}
	//draws the line
	draw(){
		line(this.points[0].x*M, this.points[0].y*M, this.points[1].x*M, this.points[1].y*M);
	}
}
class LineCollider{
	/**
	 * A LineCollider is responsible for all collisions handling like a extension to a MyLine this also get pushed into a global-colliders-array
	 *
	 * @param {MyLine} line The Line that want to handle collisions
	 */
	constructor(line) {
		this.collider = line;
		//holds all objects that are in collision in each momment
		this.collisions = [];
		lineColliders.push(this);
	}
	/**
	 * Update if a ball is in collision with this line. It push objects into it
	 *
	 * @param {MyEllipse} ball Checks if this ball is in collision with this Line
	 * 
	 */
	updateBallCollision(ball){
		if(this.collider.distance(ball.points[0]) < ball.radius){
			if(!this.containsObject(ball)){
				this.collisions.push(ball);
			}
		}
		else{
			this.deleteObject(ball);
		}
	}
	/**
	 * Checks if a obj is in collision with this line
	 *
	 * @param {Object} obj checks if obj is in collision with this line
	 * @return {boolean} return true if true and false if false
	 */ 
	containsObject(obj){
		for(let i = 0; i < this.collisions.length; i++){
			if(this.collisions[i] === obj){
				return true;
			}
		}
		return false;
	}
	/**
	 * delete a obj out of collisions array if it is in
	 *
	 * @param {Object} obj delete this obj out of the array
	 */
	deleteObject(obj){
		for(let i = 0; i < this.collisions.length; i++){
			if(this.collisions[i] === obj){
				this.collisions.splice(i,1);
			}
		}
	}
}
class Scene{
	/**
	 * A Scene contains everything that we need to load one Scene in the Canvas.
	 *
	 * @param {number} sceneNr Number of Scene
	 * @param {function} setup, the setupfunction for this Scene
	 * @param {function} process, the function that performs the action that need to be called evey frame
	 * @param {function} background, the function that draws everything in the Background
	 * @param {function} front, the function that draws everything in the front
	 * @param {function} UI, the function that draws everything from the UI
	 */
	constructor(sceneNr, setup, process, background, front, UI) {
		this.sceneNr = sceneNr;
		this.setup = setup;
		this.process = process;
		this.background = background;
		this.front = front
		this.UI = UI;
	}
	Start(){
		this.setup();
	}
	Update(){
		this.process();
		push();
		translate(xi0,yi0);
			clear();
			this.background();
			this.front();
		pop();
		this.UI();
	}
}
class MyInput{
	/**
	 * A Scene contains everything that we need to load one Scene in the Canvas.
	 *
	 * @param {MyPoint} pos where the Input should stay (doesnt work)
	 * @param {string} text that displays first in the box.
	 */
	constructor(pos, text) {
		this.pos = pos;
		this.text = text;
	}
	Awake(){
		console.log(this.text);
		this.input = createInput(this.text);
		//this.input.position(this.pos.x, this.pos.y);
		this.input.input(this.MyInputEvent);
	}
	Destroy(){
		if(this.input)
			this.input.remove();
	}
	MyInputEvent(){
		//console.log(this.value());
	}
	GetValue(){
		return this.input.value();
	}
}

class Goal{
	/**
	 * 
	 * @param {MyShape}shape shape of the goal
	 * @param {string} player the player who owns this goal
	 */
	constructor(shape, player) {
		this.shape = shape;
		this.player = player;
	}
	score(){
		vMid.x = 0;
		Vector_Move = new MyVector2D(0,0);
		if(this.player.includes("player_L")){
			score_Player_R++;
			playersTurn = 1;
			mode = 2;
			Shapes.ball.myPosition(new MyPoint(0,-radius));
			startedMove = false;
		}
		if(this.player.includes("player_R")){
			score_Player_L++;
			playersTurn = 2;
			mode = 2;
			Shapes.ball.myPosition(new MyPoint(0,-radius));
			startedMove = false;
		}
	}
	checkIfScore(){
		let midPoint = getMidPoint(this.shape.points[0], this.shape.points[1]);
		midPoint.myTranslate(new MyVector2D(0,-Shapes.ball.radius));
		if(abs(Shapes.ball.points[0].getDifference(midPoint).x) - Shapes.ball.radius<= 0){
			this.score();
		}
	}
}