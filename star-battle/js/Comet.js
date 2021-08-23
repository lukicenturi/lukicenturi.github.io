// comet class
class Comet extends SkyObject{
    constructor(){
        super(`<div class='comet animation'></div>`, 2);

        this.x = Math.floor(Math.random() * (1600 - this.w)) + 200;
        this.y = -100;
        this.sx = -2;
        this.sy = 6;
    }
}