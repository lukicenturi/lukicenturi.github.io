// particle class
class Particle extends SkyObject{
    constructor(x, y, sx, sy){
        super(`<div class='particle animation'></div>`);

        this.x = x;
        this.y = y;
        this.sx = sx;
        this.sy = sy;
    }
}