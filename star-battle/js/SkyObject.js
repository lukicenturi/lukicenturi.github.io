// main object class
class SkyObject{
    constructor(object, isPrepend = 1){
        this.object = $(object);

        this.object.css({
            top: -150,
            left: -150
        });

        if(isPrepend === 1){
            $('.element').append(this.object);
        }else if(isPrepend === 2){
            $('.element').prepend(this.object);
        }

        this.w = this.object[0].offsetWidth;
        this.h = this.object[0].offsetHeight;
        this.sx = 0;
        this.sy = 0;
    }

    update(isPlayer = 0) {
        if (isPlayer) {
            this.ax = (this.toX - this.x) / 150;
            this.ay = (this.toY - this.y) / 150;

            this.sx = (this.sx + this.ax * this.speed);
            this.sy = (this.sy + this.ay * this.speed);
        }

        this.x = Math.round(this.x + this.sx);
        this.y = Math.round(this.y + this.sy);

        if (isPlayer) {
            this.sx /= this.friction;
            this.sy /= this.friction;

            this.x = Math.max(70, Math.min(1600 - this.w, this.x));
            this.y = Math.max(0, Math.min(900 - this.h, this.y));
        }

        this.object.css({
            top: this.y,
            left: this.x
        });
    }
}