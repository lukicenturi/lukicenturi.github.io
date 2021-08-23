// enemy class
class Enemy extends SkyObject{
    constructor(){
        super(`<div class='enemy animation'></div>`);

        this.x = 1610;
        this.y = Math.floor(Math.random() * (900 - this.h));
        this.score = 5;
        this.sx = -5;
        this.interval = setInterval(()=>{
            if(game.isCan()){
                game.object.push(new Bullet(this.x - 20, this.y + 40, -14));
            }
        }, 1000 + Math.floor(Math.random() * 1000));
    }
}