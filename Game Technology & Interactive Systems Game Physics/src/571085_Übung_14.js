/**************************************************/
/* Autor:  Dr. Volkmar Naumburger                 */
/* Changed by: Juri Wiechmann                     */
/* p5.js Abschlussarbeit	                      */
/* Stand: 27.02.2021                              */
/*                                                */
/**************************************************/
//*********** Buggs die bekannt sind *********************/
/*
1: 	Wenn man beim ziehen der Touchareas außerhalb eben dieser kommmt, geht das programm nicht weiter.
	Lösung bekannt -----> noch nicht implementiert.
	(Touchareas bis zum Realese der Maus stark vergrößern)
		
2: 	Man erstellt bein Objekt und in der nächsten Zeile gibt man dieses in der Konsole aus z.b.:
	var x = 5;
	console.log(x);
	Es kann vorkommen, dass nun x != 5 ist. Die Konsole vom Chrome wird erst später geladen, heißt wenn im
	Verlauf des Programs x geändert wird steht nun die Änderung da:
	Konsole:
	"x = 10"
	
	Auch wenn wir x erst viel später im Code irgendwie ändern und der Befehl der Konsolenausgabe direkt nach der Deklaration ist.
	Lösung bekannt -----> implementiert.
3:	pScene1 Z: 161-163. in Shapes.ball_R.myTranslate(Vector_Move.rotate(2*angle_R_default).frame()); muss "angle_R_default mit 2 multipliziert werden. 
	Grund nicht bekannt
	Lösung nicht bekannt(nothilfe, es mit 2 einfach zu multiplizieren)
4: 	Funktion "Collision" ist fehlerhaft. Einkommende Vektoren und Positionen erscheinen unpassend für zurückgegebene Vektoren.
	Lösung -----> durch die Kommunikation mit Kommilitonen kam herraus, dass dieser Fehler bekannt und weit verbreitet ist. Diese meinten Sie erkennen die Lösung an, eine Unterscheidung zu treffen.
	Nun wird bei einer Kollision unterschieden, ob diese horizontal stattfindet(beide Bälle haben den gleichen y-Wert) oder nicht.
	Da ich durch sehr langem Probieren immer einen dieser beiden Unterscheidungen zum laufen gebracht habe, habe ich dies nun ebenfalls angewendet.
	*/
/*
Wenn Sie im Spiel und nicht in der Testscene die Kollision mit einem Hüpfeffekt testen wollen:
	Gehen Sie in die Datei pControls
	Wenn Sie mit dem linken Ball den mitteren Ball treffen wollen:
		Gehen Sie in Zeile 125 und setzten Sie den "startangle" in 9.9 um.
	Wenn Sie mit dem rechten Ball den mitteren Ball treffen wollen:
		Gehen Sie in Zeile 115 und setzten Sie den "startangle" in 9.9 um.
Um in der Testscene die Bälle zu Positionieren(drag and draop)
Um in der Testcene die Vektoren der Bälle einzugestellen:
	Unter dem Cancas sind 2 Inputfelder. Diese waren ursprünglich besser positioniert. Durch das einführen eines gefüllten Bildschirms, sind diese leider nach unten verdrängt worden.
 */

var currScene;

function setup() {
	setupStart();
	//startScene
	currScene = Scene0;
	currScene.Start();
}
function draw() {
	collThreshCalc()
	currScene.Update();
}
function changeScene(nextScene){
	clear();
	for (const [key, value] of Object.entries(InputFields)) {
		value.Destroy();
	}
	currScene = nextScene;
	currScene.Start();
}

