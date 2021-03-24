/**
 * A Calculator to get a Vector that fits the rules of the movement on a Pad in angle
 * 
 * @param {MyVector2D} v incomming Vector we want to change that it is a Pad_movement-Vector
 * @param {number} angle the angle of the pad 
 * @return {MyVector2D} the new Vector for a Pad_movement
 */
function Pad_Movement(v, angle){
    let result = new MyVector2D(v.x, v.y);
    result.x += setCorrection*(g * sin(angle) * dt);
    result = moveOnSurface(result, angle, true);
    return result;
}

/**
 * A Calculator to get a Vector that fits the rules of the movement on Surface
 * 
 * @param {MyVector2D} v incomming Vector we want to change that it is a movement on a Surface
 * @param {number} angle the angle of the Surface
 * @param {boolean} friction if we consider friction
 * @return {MyVector2D} the new Vector for a movement on a Surface
 */
function moveOnSurface(v, angle, friction){
    let result = new MyVector2D(v.x, v.y);
    result.y = 0;
    if(friction){
        let sign;
        if(result.x < 0)
            sign = -1;
        else
            sign = 1;
        result.x -= g*sign*muR*cos(angle)*dt;
    }
    return result;
}
/**
 * A Calculator to get a Vector that fits the rules of the movement in the Air
 *
 * @param {MyVector2D} v incomming Vector we want to change that it is a movement in the Air
 * @return {MyVector2D} the new Vector for a movement in the Air
 */
function moveInAir(v){
    let result = new MyVector2D(v.x, v.y)
    if(friction){
        result.x = result.x - (result.x * sqrt(sq(result.x) + sq(result.y))/(2*tau))*dt;
        result.y = result.y + (g + result.y * sqrt(sq(result.x) + sq(result.y))/(2*tau))*dt;
    }
    else{
        //result.x = result.x;
        result.y = result.y + g*dt;
    }
    return result;
}
/**
 * Check if the 2 Balls Collided
 *
 * @param {MyEllipse} ball1 first ball
 * @param {MyEllipse} ball2 second ball
 */
function checkBallCollision(ball1, ball2){
    let distance = ball1.points[0].getDifference(ball2.points[0]).value();
    let sumRadius = ball1.radius + ball2.radius;
    return (sumRadius >= distance) && collisionPossible;
}
/**
 * Calculates the outcomming Vectors after a Collision happens
 * 
 * @param {MyEllipse} ball1 first ball.
 * @param {MyVector2D} Vector1 Movevector from 1. Ball.
 * @param {MyEllipse} ball2 second ball.
 * @param {MyVector2D} Vector2 Movevector from 2. Ball.
 * @return {[MyVector2D, MyVector2D]} first Vector is for 1. ball and second Vector is for 2. ball
 */
function Collision(ball1, Vector1, ball2, Vector2){
    //console.log("Ball1: (" + ball1.getX() + "/" + ball1.getY() + ") Ball2: (" + ball2.getX() + "/" + ball2.getY() + ")");
    //console.log("Vector1: (" + Vector1.x + "/" + Vector1.y + ") Vector2: (" + Vector2.x + "/" + Vector2.y + ")");
    collisionPossible = false;
    
    //Wenn die Bällte nicht Horizontal aufeinander treffen
    if(ball1.getY() != ball2.getY()){
        let beta = atan2(ball1.getY() + ball2.getY(), ball1.getX() - ball2.getX())
        let phi = beta - 90;
        let m1 = ball1.mass;
        let m2 = ball2.mass;

        let v1 = rotCoordSystem(Vector1, phi);
        let v2 = rotCoordSystem(Vector2, phi);

        let v1_ = new MyVector2D(
            v1.x,
            ((m1-m2)*v1.y+2*m2*v2.y)/(m1+m2)
        )
        let v2_ = new MyVector2D(
            v2.x,
            ((m2-m1)*v2.y+2*m1*v1.y)/(m1+m2)
        )
        let result = [
            rotCoordSystem(v1_, -phi), rotCoordSystem(v2_, -phi)
        ]
        if(ebene){
            result[0].y = result[0].y- result[1].y;
            result[1].y = 0;
        }
        return result;
    }
    else{
        //wenn die Bälle horizontal aufeinander Prallen
        let result = [
            new MyVector2D(0,0), new MyVector2D(Vector1.x,0)
        ]
        return result;
    }
}
/**
 * 
 * @param {MyVector2D} v Vector we rotate
 * @param {number} phi angle we rotate
 * @return {MyVector2D} new CoordSystemVector
 */
function rotCoordSystem(v, phi)
{
    var x = v.x*cos(phi) + v.y*sin(phi);
    var y = -v.x*sin(phi) + v.y*cos(phi);
    return new MyVector2D(x, y);
}
