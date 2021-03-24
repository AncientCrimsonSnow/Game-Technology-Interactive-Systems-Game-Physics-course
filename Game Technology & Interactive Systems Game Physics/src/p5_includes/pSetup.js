function setupCanvas(){
	//Fenster-Maße:
	w =  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	h = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
	canvas = createCanvas(w, h);
	canvas.parent(canvasID);
}
function setupFramerate(){
	frmRate = 60;
	frameRate(frmRate);
	dt = 1.0/frmRate;
}
function setupScale(){
	// Vorbereitung für maßstabsgerechtes, kartesisches Koordinatensystem
	xi0 = 0.5*width;               // int. Nullpunkt für kart. Koordinatensystem rel. zum internen K.
	yi0 = 0.8*height;
    M = 0.775 * canvas.width/(hw*2);                         // Berechnung des Maßstabs
}
function setupStart(){
	//Setup startangles and set the angleMode
    angleMode(DEGREES);
	t = 0;
  	//initialize all Objects in startposition:
	//half width of default canvas(1200)
	setupCanvas();
	setupFramerate();
	setupScale();
}