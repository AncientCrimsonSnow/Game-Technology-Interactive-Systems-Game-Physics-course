let sceneSetup0 = function(){

}
let process0 = function (){

}
let draw_background0 = function (){

}
let draw_front0 = function (){

}
let draw_UI0 = function (){
    for (let i = 0; i<areas.length; i++){
        if(areas[i].shape.appearance.normalized &&
            areas[i].sceneNr == currScene.sceneNr){
            areas[i].shape.draw();
            areas[i].setText();
        }
    }
}

Scene0 = new Scene(0, sceneSetup0, process0, draw_background0, draw_front0, draw_UI0);