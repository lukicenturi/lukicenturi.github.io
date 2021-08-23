// friend class
class Friend extends SkyObject{
    constructor(){
        super(`<div class='friend animation'></div>`);

        this.x = 1610;
        this.y = Math.floor(Math.random() * (900 - this.h));
        this.score = -10;
        this.sx = -4;
    }
}