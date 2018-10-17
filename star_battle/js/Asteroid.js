// asteroid class
class Asteroid extends SkyObject{
    constructor(){
        let asteroid = Math.floor(Math.random() * 2);
        super(`<div class='asteroid animation' data-asteroid="${asteroid}" data-life="2"></div>`);

        this.x = 1610;
        this.y = Math.floor(Math.random() * (900 - this.h));
        this.score = 10;
        this.sx = -6;
        this.life = 2;
    }
}