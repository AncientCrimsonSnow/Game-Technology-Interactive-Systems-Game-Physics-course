let sceneSetup1 = function(){
    mode = 1;
    transition_L = Shapes.pad_L_collider.reverseDistanceX(0,0);
    transition_R = Shapes.pad_R_collider.reverseDistanceX(0,0);
}
let process1 = function (){
    /*
        Ich habe mich dafür entschieden mein Programm zur Übersicht in verschiedenen Modi durchlaufen zu lassen:
        In diesem switch-Case werden dabei nur die passenden Vektoren ausgerechnet. Die Ausführung dieser geschieht danach
            Mode 0 : default Mode. Alle Funktionen welche im Mode 0 aufzurufen sind, sind in jedem Mode aufzurufen.
            Mode 1  : In diesem Modus startet das Programm. Hier wird einmal Initialisiert.
            Mode 2  : Hier wartet das Programm auf einen Input (Touchfelder, Startbutton etc.)
        Mode 3  : Player_R hat die touchArea_R berührt. angle_R ist nun in Änderung (---> MODE 4).
        Mode 4  : Player_L hat die touchArea_L berührt. angle_L ist nun in Änderung (---> MODE 5).
        Mode 5  : Player_R hat die touchArea_R losgelassen. Berechnung und Ausführung des Fluges von ball_R bis ball_R auf...
        Grund aufkommt 		(---> MODE 7).
        pad_R aufkommt		(---> MODE 9).
        pad_L aufkommt		(---> MODE 11).
        Mode 6  : Player_L hat die touchArea_L losgelassen. Berechnung und Ausführung des Fluges von ball_L bis ball_L auf...
        Grund aufkommt 		(---> MODE 8).
        pad_R aufkommt		(---> MODE 10).
        pad_L aufkommt		(---> MODE 12).
        Mode 7  : Horizontale Bewebung von ball_R startet bis...
        Kontakt mit pad_R	(---> MODE 9).
        Kontakt mit pad_L 	(---> MODE 11).
        Mode 8  : Horizontale Bewebung von ball_L startet bis...
        Kontakt mit pad_R	(---> MODE 10).
        Kontakt mit pad_L	(---> MODE 12).
        Mode 9  : ball_R bewegt sich auf pad_R auf und ab (---> MODE 7).
        Mode 10 : ball_L bewegt sich auf pad_R auf und ab (---> MODE 8).
        Mode 11 : ball_R bewegt sich auf pad_L auf und ab (---> MODE 7).
        Mode 12 : ball_L bewegt sich auf pad_L auf und ab (---> MODE 8).
    */
    switch(mode){
        case 1:
            init();
            break;
        case 2:
            positionPlayerBallsToAngle();
            break;
        case 3:
            init_R();
            changeMode(5, Shapes.ball_R);
            break;
        case 4:
            init_L();
            changeMode(6, Shapes.ball_L);
            break;
        case 5:
            startedMove = true;
            Vector_Move = moveInAir(Vector_Move);
            updateAllLineCollider(Shapes.ball_R);

            if(Colliders.pad_R.containsObject(Shapes.ball_R)){
                changeMode(9, Shapes.ball_R);
                break;
            }
            if(Colliders.pad_L.containsObject(Shapes.ball_R)){
                changeMode(11, Shapes.ball_R);
                break;
            }
            if(ground_Check(Shapes.ball_R)){
                changeMode(7, Shapes.ball_R);
                break;
            }
            break;
        case 6:
            startedMove = true;
            Vector_Move = moveInAir(Vector_Move);
            updateAllLineCollider(Shapes.ball_L);

            if(Colliders.pad_R.containsObject(Shapes.ball_L)){
                changeMode(10, Shapes.ball_L);
                break;
            }
            if(Colliders.pad_L.containsObject(Shapes.ball_L)){
                changeMode(12, Shapes.ball_L);
                break;
            }
            if(ground_Check(Shapes.ball_L)){
                changeMode(8, Shapes.ball_L);
                break;
            }
            break;
        case 7:
            Vector_Move = moveOnSurface(Vector_Move, 0, true);            
            updateAllLineCollider(Shapes.ball_R);
            
            if(Colliders.pad_L.containsObject(Shapes.ball_R)){
                changeMode(11, Shapes.ball_R);
            }
            if(Colliders.pad_R.containsObject(Shapes.ball_R)){
                changeMode(9, Shapes.ball_R);
            }
            break;
        case 8:
            Vector_Move = moveOnSurface(Vector_Move, 0, true);
            updateAllLineCollider(Shapes.ball_L);
            
            if(Colliders.pad_R.containsObject(Shapes.ball_L)){
                changeMode(10, Shapes.ball_L);
            }
            if(Colliders.pad_L.containsObject(Shapes.ball_L)){
                changeMode(12, Shapes.ball_L);
            }
            break;
        case 9:
            Vector_Move = Pad_Movement(Vector_Move, angle_R_default);
            if(Shapes.ball_R.points[0].x <= transition_R){
                changeMode(7, Shapes.ball_R);
            }
            break;
        case 10:
            Vector_Move = Pad_Movement(Vector_Move, angle_R_default);
            
            if(Shapes.ball_L.points[0].x <= transition_R){
                changeMode(8, Shapes.ball_L);
            }
            break;
        case 11:
            Vector_Move = Pad_Movement(Vector_Move, angle_L_default);
            if(Shapes.ball_R.points[0].x >= transition_L){
                changeMode(7, Shapes.ball_R);
            }
            break;
        case 12:
            Vector_Move = Pad_Movement(Vector_Move, angle_L_default);
            
            if(Shapes.ball_L.points[0].x >= transition_L){
                changeMode(8, Shapes.ball_L);
            }
            break;
        default:
    }
    //console.log("turn: " + playersTurn + " / mode: " + mode);
    if(mode >= 3 && !modeHasChanged()){
        
        //if(mode ==7){debugger;}
        //Wenn einer der beider Spielerbälle mit dem mittleren Ball kollidieren
        let currentPlayerBall = (playersTurn == 1)? Shapes.ball_L : Shapes.ball_R;
        if(checkBallCollision(currentPlayerBall, Shapes.ball)){
            
            //Die eingehenden Vektoren:
            console.log("V1: (" + Vector_Move.x + "/" + Vector_Move.y + ")");
            console.log("V2: (" + vMid.x + "/" + vMid.y + ")");
            //Die eingehenden Ballpositionen:
            console.log("P1: (" + currentPlayerBall.getX() + "/" + currentPlayerBall.getY() + ")");
            console.log("P2: (" + Shapes.ball.getX() + "/" + Shapes.ball.getY() + ")");
            
            result = Collision(currentPlayerBall, Vector_Move, Shapes.ball, vMid);
            Vector_Move = result[0];
            vMid = result[1];
            
            //Die herauskommenden Vektoren:
            console.log("V1: (" + Vector_Move.x + "/" + Vector_Move.y + ")");
            console.log("V2: (" + vMid.x + "/" + vMid.y + ")");
            console.log("=================================");
             
        }
        //Anwendung der Bewebungvektoren
        if(vMid.x != 0){
            vMid = moveOnSurface(vMid, 0,true);
            Shapes.ball.myTranslate(vMid.frame()); 
        }
        if(playersTurn == 1){
            if(mode == 10){
                Shapes.ball_L.myTranslate(Vector_Move.rotate(angle_R_default).frame());
            }
            else if(mode == 12){
                Shapes.ball_L.myTranslate(Vector_Move.rotate(angle_L_default).frame());
            }
            else{
                Shapes.ball_L.myTranslate(Vector_Move.frame());
            }
        }
        if(playersTurn == 2){
            if(mode == 9){
                //warum muss in diesem einzigen Fall der winkel bei der Vektorrotation mit 2 multipliziert von -20 auf -40???
                //console.log(Vector_Move);
                Shapes.ball_R.myTranslate(Vector_Move.rotate(2*angle_R_default).frame());
            }
            if(mode == 11){
                Shapes.ball_R.myTranslate(Vector_Move.rotate(angle_L_default).frame());
            }else{
                Shapes.ball_R.myTranslate(Vector_Move.frame());
            }
        }
        for (const [key, goal] of Object.entries(Goals)) {
            goal.checkIfScore();
        }
        if(notRolling() && startedMove){
            switchPlayers();
            startedMove = false;
            mode = 2;
        }
    }
}
let draw_background1 = function (){
    background(255,255,255);
    //Erdoberfläche
    let ground = 0;
    fill('#e7d59f')
    rect(-canvas.width/2, ground, canvas.width, yi0);
    Shapes.d_R.draw();
    Shapes.d_L.draw();
    Shapes.sd_R.draw(angle_R,Shapes.d_R.points[2]);
    Shapes.sd_L.draw(angle_L,Shapes.d_L.points[2]);
    //Halfcircle
    arc(480*M, 0, 10*M, 10*M, 180, 360);
    arc(-480*M, 0, 10*M, 10*M, 180, 360);
    Shapes.tl_R.draw();
    Shapes.tl_L.draw();
}
let draw_front1 = function (){
    Shapes.ball.draw();

    Shapes.ball_R.draw();
    Shapes.ball_L.draw();

    Colliders.pad_L.collider.draw();
    Colliders.pad_R.collider.draw();

    Shapes.pad_R.draw(angle_R,Shapes.d_R.points[2]);
    Shapes.pad_L.draw(angle_L,Shapes.d_L.points[2]);

    //Update Position of TouchAreas:
    Areas.touchArea_R.shape.myPosition(getCirclePoint(Shapes.d_R.points[2], angle_R, Shapes.pad_R.w/2));
    Areas.touchArea_L.shape.myPosition(getCirclePoint(Shapes.d_L.points[2], angle_L, -Shapes.pad_L.w/2));
    //Lädt alle Areas welche nicht normalized sind
    for (let i = 0; i<areas.length; i++){
        if(!areas[i].shape.appearance.normalized &&
            areas[i].sceneNr == currScene.sceneNr){
            areas[i].shape.draw();
            areas[i].setText();
        }
    }
}
let draw_UI1 = function (){
    //UI
    let goalPosition = new MyPoint(w - startButton_border - startbutton_w, h - startButton_border - startbutton_h);
    Areas.startButton.shape.myPosition(goalPosition);
    //Läd alle Areas welche normalized sind
    for (let i = 0; i<areas.length; i++){
        if(areas[i].shape.appearance.normalized &&
            areas[i].sceneNr == currScene.sceneNr){
            areas[i].shape.draw();
            areas[i].setText();
        }
    }
    //Score
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Treffer " + score_Player_L + " : " + score_Player_R, 0+xi0, 0+yi0 - 200);
}
Scene1 = new Scene(1,sceneSetup1, process1, draw_background1, draw_front1, draw_UI1);





