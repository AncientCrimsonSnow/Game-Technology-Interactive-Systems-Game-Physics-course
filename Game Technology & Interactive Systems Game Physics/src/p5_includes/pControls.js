//resizes the canvas in relation to the windowssize
function windowResized() {
	
	// In der letzte Übung wurde Vollbild gewünscht, daher auskommentiert
	//update canvassize to windows:
	/*
	w = 0.9*window.innerWidth;
	h = 0.9*window.innerHeight;
	M = 0.7 * canvas.width/1200; 
	resizeCanvas(w, h);
	xi0 = 0.5*width;               // int. Nullpunkt für kart. Koordinatensystem rel. zum internen K.
	yi0 = 0.8*height;
	*/
}
//Trigger all MyActions with "release" as actionMode
function mouseReleased(){
	//go through all areas
	for (var i = 0; i < areas.length; i++){
		//if mouse is in area and the area has actions
		if(	areas[i].checkMouse()				&&
			areas[i].actions					&&
			areas[i].sceneNr == currScene.sceneNr
			){
			//go through all actions
			for(var j = 0; j < areas[i].actions.length; j++){
				//if the mouseMode is "release" and the mode is 0 or the current one
				if(	areas[i].actions[j].mouseMode == "release"	&&
					(	areas[i].actions[j].mode == 0			||
						areas[i].actions[j].mode == mode
					)){
					//calls the action
					areas[i].actions[j].action(areas[i]);
				}	
			}
		}
	}
}
//Trigger all MyActions with "pressed" as actionMode
function mousePressed(){
	//go through all areas
	for (var i = 0; i < areas.length; i++){
		//if mouse is in area and the area has actions
		if(	areas[i].checkMouse()				&&
			areas[i].actions					&&
			areas[i].sceneNr == currScene.sceneNr
			){
			//go through all actions
			for(var j = 0; j < areas[i].actions.length; j++){
				//if the mouseMode is "pressed" and the mode is 0 or the current one
				if(	areas[i].actions[j].mouseMode == "pressed"	&&
					(	areas[i].actions[j].mode == 0			||
						areas[i].actions[j].mode == mode
					)){
					//calls the action
					areas[i].actions[j].action(areas[i]);
				}			
			}
		}
	}
}
//Trigger all MyActions with "drag" as actionMode
function mouseDragged(){
	//go through all areas
	for (var i = 0; i < areas.length; i++){
		//if mouse is in area and the area has actions
		if(	areas[i].checkMouse()				&&
			areas[i].actions					&&
			areas[i].sceneNr == currScene.sceneNr
			){
			//go through all actions
			for(var j = 0; j < areas[i].actions.length; j++){
				//if the mouseMode is "drag" and the mode is 0 or the current one
				if(	areas[i].actions[j].mouseMode == "drag"	&&
					(	areas[i].actions[j].mode == 0			||
						areas[i].actions[j].mode == mode
					)){
					//calls the action
					areas[i].actions[j].action(areas[i]);
				}
						
			}
		}
	}
}
/**
 * Returns a point that represents the mouse position.
 *
 * @param {boolean} kat If the point is normilized or in the Cartesian coordinate system.
 * @return {MyPoint} the Mouse position.
 */
function getMousePoint(kat){
	if(kat){
		const kat_mouseX = (mouseX - xi0)/M;
		const kat_mouseY = (mouseY - yi0)/M;
		return kat_mouseP = new MyPoint(kat_mouseX, kat_mouseY);
	}
	return new MyPoint(mouseX,mouseY);
}
function init(){
	//reset angles
	angle_R = angle_R_default;
	angle_L = angle_L_default;
	//reset TouchAreas
	Areas.touchArea_R.shape.myPosition(getCirclePoint(Shapes.d_R.points[2], angle_R, Shapes.pad_R.w/2));
	Areas.touchArea_L.shape.myPosition(getCirclePoint(Shapes.d_L.points[2], angle_L, -Shapes.pad_L.w/2));
	//reset all Balls
	positionPlayerBallsToAngle();
	Shapes.ball.myPosition(new MyPoint(0,-radius));
	//set playerturn to 0
	playersTurn = 0;
	//reset score
	score_Player_R = score_Player_L = 0;
}
function init_R(){
	let startangle = angle_R;
	//let startangle = 9.9;
	v0 = 700 * ((angle_L_default + startangle)/angle_L_default);
	v0x = v0 * sin(angle_R_default);
	v0y = -v0 * cos(angle_R_default);
	Vector_Move = new MyVector2D(v0x, v0y);
	angle_R = angle_R_default;
	playersTurn = 2;
}
function init_L(){
	let startangle = angle_L;
	//let startangle = 9.9;
	v0 = 700 * ((angle_R_default + startangle)/angle_R_default);
	v0x = v0 * sin(angle_L_default);
	v0y = -v0 * cos(angle_L_default);
	Vector_Move = new MyVector2D(v0x, v0y);
	angle_L = angle_L_default;
	playersTurn = 1;
}
/**
 * Checks if the Ball hits the ground
 *
 * @param {MyEllipse} ball , who hits the ground
 * @return {boolean} true if the ball hits the ground
 */
function ground_Check(ball){
	return ball.points[0].y >= -ball.radius;
}
/**
 * Update all LineColliders we have and checks if a obj is in collision with them
 * @param {MyEllipse} obj , which get checked
 */
function updateAllLineCollider(obj){
	for(let i = 0; i < lineColliders.length; i++){
		lineColliders[i].updateBallCollision(obj);
	}
}
/**
 * A function that helps us to change the mode
 * @param {number} nextMode the mode into which we change
 * @param {MyEllipse} ball the ball we position for the next mode
 */
function changeMode(nextMode, ball){
	ball.myPosition(getStartPosition(nextMode));
	if(mode == 7 || mode == 8){
		ball.myTranslate(Vector_Move.frame());
	}
	mode = nextMode;
}
/**
 * Some modes have a startposition for the ball. Here we get it
 * @param {number} mode on which base we want to get our startposition
 * @return {MyPoint} the startposition
 */
function getStartPosition(mode){
	switch(mode){
		case 5:
			return rotate_point(Shapes.d_R.points[2], Uniform.balls.ball_R.default, angle_R);
		case 6:
			return rotate_point(Shapes.d_L.points[2], Uniform.balls.ball_L.default, angle_L);
		case 7:
			return new MyPoint(Shapes.ball_R.points[0].x, -Shapes.ball_R.radius);
		case 8:
			return new MyPoint(Shapes.ball_L.points[0].x, -Shapes.ball_L.radius);
		case 9:
			return Colliders.pad_R.collider.getCollisionPoint(radius, Shapes.ball_R, Vector_Move);
		case 10:
			return Colliders.pad_R.collider.getCollisionPoint(radius, Shapes.ball_L, Vector_Move);
		case 11:
			return Colliders.pad_L.collider.getCollisionPoint(radius, Shapes.ball_R, Vector_Move);
		case 12:
			return Colliders.pad_L.collider.getCollisionPoint(radius, Shapes.ball_L, Vector_Move);
		default:
			console.log("No Startposition in mode " + mode);
			return null;
	}
}
/**
 * A temporarily rotation of our coordinate-system
 *
 * @param {number} angle the angle we rotate the system
 * @param {MyPoint} p the point we rotate our system around
 */
function myRotate(angle, p){
	push();
	translate(p.x*M, p.y*M);
	rotate(angle);
}

/**
 * Position both playball to their ramp
 */
function positionPlayerBallsToAngle(){
	Shapes.ball_R.myPosition(rotate_point(Shapes.d_R.points[2], Uniform.balls.ball_R.default, angle_R));
	Shapes.ball_L.myPosition(rotate_point(Shapes.d_L.points[2], Uniform.balls.ball_L.default, angle_L));
}
/**
 * return true if no balls are rolling
 * @return {boolean}
 */
function notRolling() {
	let notOutofScreen = (abs(Shapes.ball_R.getX()) < 1000) && (abs(Shapes.ball_L.getX()) < 1000)
	if(notOutofScreen)
		return (round(vMid.x/4) === 0) && (round(Vector_Move.x/10) === 0) && (mode < 9);
	else
		return (round(vMid.x/4) === 0) && (mode < 9);
}
/**
 * switch the playerturn 1 -> 2; 2->1
 */
function switchPlayers(){
	if(playersTurn == 1)
		playersTurn = 2;
	else if(playersTurn == 2){
		playersTurn = 1;
	}
}

/**
 * returns true if the mode from the last frame is a different one than the current one
 * @return {boolean}
 */
function modeHasChanged(){
	if(lastframeMode == mode){
		return false;
	}
	else{
		lastframeMode = mode;
		return true;
	}
}

/**
 * Handles the behavior of the collisionThreshhold
 * if collisionPossible == true
 */
function collThreshCalc(){
	//console.log(collisionPossible);
	if(!collisionPossible){
		collisionThreshhold -= dt;
		if(collisionThreshhold <= 0){
			collisionPossible = true;
			collisionThreshhold = 0.5;
		}
	}
}