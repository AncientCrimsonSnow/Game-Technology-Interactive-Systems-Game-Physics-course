/**
 * Calculate the Circlepoint
 *
 * @param {MyPoint} anglePoint point where we rotate around.
 * @param {number} degrees in which degrees we rotate.
 * @param {number} radius the radius we rotate.
 */
function getCirclePoint(anglePoint, degrees, radius){
	const x = anglePoint.x + radius * Math.cos(degrees_to_radians(degrees));
	const y = anglePoint.y +radius * Math.sin(degrees_to_radians(degrees));
	return new MyPoint(x,y);
}
function degrees_to_radians(degrees){
  	return degrees * (Math.PI/180);
}
function radians_to_degrees(radians){
	return radians * (180 / Math.PI);
}
function degree(center, p) {
	return Math.atan2(p.y - center.y, p.x - center.x) * 180 / Math.PI;
}
/**
 * Returns a value that is limited.
 *
 * @param {number} value The number to limit.
 * @param {number} max the maximum that our value is allowed to reach.
 * @param {number} min the minimum that our value is allowed to reach.
 * @return {number} value the limited Value.
 */
function limit(value, max, min){
	if (value > max)
		value = max;
	else if(value < min)
		value = min;
	return value;
}
/**
 * Returns a point that is rotated in an angle around an pivot
 *
 * @param {MyPoint} pivot the pivot we rotate around.
 * @param {MyPoint} p the point we want to rotate.
 * @param {number} angle the angle around which we rotate.
 * @return {MyPoint} the new position from the rotated point.
 */
function rotate_point(pivot, p, angle){
	const s = Math.sin(degrees_to_radians(angle));
	const c = Math.cos(degrees_to_radians(angle));
	let temp = new MyPoint(p.x - pivot.x, p.y - pivot.y);

	const xnew = temp.x * c - temp.y * s;
	const ynew = temp.x * s + temp.y * c;
	temp.myPosition(new MyPoint(xnew + pivot.x, ynew + pivot.y));
	return temp;
}/**
 * creates a lineare Function out of 2 points
 *
 * @param {MyPoint} p0 point 0.
 * @param {MyPoint} p1 point 1.
 */
class lineareFunction{
	constructor(p0, p1) {
		this.p0 = p0;
		this.p1 = p1;

		let dy = p1.y - p0.y;
		let dx = p1.x - p0.x;
		//slope
		this.m = dy/dx;
		//
		this.b = p0.y - this.m * p0.x;
	}
	/**
	 * calculate the Interception with another lineare function
	 *
	 * @param {lineareFunction} f the other function
	 * @return {MyPoint} the Interception point
	 */
	getInterception(f){
		f.m -= this.m;
		f.b -= this.b;
		f.b = 0 - f.b;
		return new MyPoint(f.b/f.m, this.m*(f.b/f.m) + this.b);
	}
	/**
	 * Moves this lineare function
	 *
	 * @param {MyVector2D} v Vector we use to move.
	 */
	myTranslate(v){
		this.p0.x += v.x;
		this.p1.x += v.x;
		this.b += v.x * this.m;

		this.p0.y += v.y;
		this.p1.y += v.y;
		this.b += v.y;
	}
}
function getMidPoint(p1, p2){
	return new MyPoint((p1.x + p2.x)/2, (p1.y + p2.y)/2)
}

