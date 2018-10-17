// bullet class
class Bullet extends SkyObject{
    constructor(x, y, sx){
        let color = sx < 0 ? 'red' : 'green';
        super(`<div class='bullet animation ${color}'></div>`);

        this.x = x;
        this.y = y;
        this.sx = sx;
    }
}