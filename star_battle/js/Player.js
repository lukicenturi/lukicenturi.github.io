// player spaceship class
class Player extends SkyObject{
    constructor(){
        super(`#player`, 0);

        this.x = 70;
        this.y = 400;
        this.ax = 0;
        this.ay = 0;
        this.toX = 70;
        this.toY = 400;
        this.speed = 1.5;
        this.friction = 1.15;
    }

    move(x, y){
        this.toX = x - this.w / 2;
        this.toY = y - this.h / 2;
    }

    shoot(){
        if(game.isCan()){
            game.object.push(new Bullet(this.x + 150, this.y + 34, 14));
        }
    }

    update(){
        super.update(1);

        if(Math.trunc(this.sx) > 0) $("#player").removeClass('back').addClass('front');
        else if(Math.trunc(this.sx) < 0) $("#player").removeClass('front').addClass('back');
        else $("#player").removeClass('front').removeClass('back');

        if(Math.trunc(this.sy) > 0) $("#player").removeClass('up').addClass('down');
        else if(Math.trunc(this.sy) < 0) $("#player").removeClass('down').addClass('up');
        else $("#player").removeClass('down').removeClass('up');
    }
}