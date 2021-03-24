let sceneSetup2 = function(){
    for (const [key, value] of Object.entries(InputFields)) { 
        value.Awake();
    }
    Areas.testBall1.shape.myPosition(new MyPoint(-100, -radiusArea));
    Areas.testBall2.shape.myPosition(new MyPoint(100, -radiusArea));
    mode = 1;
    //Diese befinden sich UNTER dem canvas
    if(ebene){
        InputFields.testball2_vx_input.Destroy();
        InputFields.testball2_vy_input.Destroy();
    }
}
let process2 = function (){
    //console.log(mode);
    let ball1 = Areas.testBall1.shape;
    let ball2 = Areas.testBall2.shape;
    switch(mode){
        case 0:
            break;
        case 1:
            //Both Balls are standing still till one of them get touched
            break;
        case 2:
            //drag ball 1 around
            break;
        case 3:
            //drag ball 2 around
            break;
        case 4:
            //start simulation
            //get v1:
            test_v1 = new MyVector2D(
                InputFields.testball1_vx_input.GetValue(),
                InputFields.testball1_vy_input.GetValue()
            );
            //get v2:
            if(!ebene){
                test_v2 = new MyVector2D(
                    InputFields.testball2_vx_input.GetValue(),
                    InputFields.testball2_vy_input.GetValue()
                );
            }
            else{
                test_v2 = new MyVector2D(
                    0,
                    0
                );
                //console.log(ball2.getX() + " / " + )
                ball2.myPosition(new MyPoint(ball2.getX(), -ball2.radius));
            }
            //if the Vectors arent numbers
            if(isNaN(test_v1.x) ||isNaN(test_v1.x) || isNaN(test_v2.x)||isNaN(test_v2.x)){
                window.alert("Movementvectors aren't Numbers");
                Areas.test_startButton.actions[0].action(Areas.test_startButton);
                break;
            }
            mode = 5;
            break;
        case 5:
            //move the balls:
            ball1.myTranslate(test_v1.frame());
            ball2.myTranslate(test_v2.frame());
            if (checkBallCollision(ball1, ball2)) {
                result = Collision(ball1, test_v1, ball2, test_v2);
                test_v1 = result[0];
                test_v2 = result[1];
                mode = 6;
            }
            break;
        case 6:
            //console.log("Collision");
            ball1.myTranslate(test_v1.frame());
            ball2.myTranslate(test_v2.frame());
            break;
        default:
    }
}
let draw_background2 = function (){
    let ground = 0;
    fill('#e7d59f')
    rect(-canvas.width/2, ground, canvas.width, yi0);
}
let draw_front2 = function (){
    for (let i = 0; i<areas.length; i++){
        if(!areas[i].shape.appearance.normalized &&
            areas[i].sceneNr == currScene.sceneNr){
            areas[i].shape.draw();
            areas[i].setText();
        }
    }
}
let draw_UI2 = function (){
    let goalPosition = new MyPoint(w - startButton_border - startbutton_w, h - startButton_border - startbutton_h);
    Areas.startButton.shape.myPosition(goalPosition);
    for (let i = 0; i<areas.length; i++){
        if(areas[i].shape.appearance.normalized &&
            areas[i].sceneNr == currScene.sceneNr){
            areas[i].shape.draw();
            areas[i].setText();
        }
    }
}

Scene2 = new Scene(2, sceneSetup2, process2, draw_background2, draw_front2, draw_UI2);







