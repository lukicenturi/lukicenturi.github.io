// fuel class
class Fuel extends SkyObject{
    constructor(){
        super(`<div class='fuel animation'></div>`);

        this.x = Math.floor(Math.random() * (1600 - this.w)) + 200;
        this.y = -100;
        this.sx = -2;
        this.sy = 3;
    }
}