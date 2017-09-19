class Tile{
    constructor(y, x, dir, rotate){
        this.image = new Image();
        this.image.src = 'img/pipe.png';
        this.y = y;
        this.x = x;
        this.width = ch / 8;
        this.dir = dir;
        this.rotate = rotate;
        this.goRotate = rotate;
        this.state = 0;
        this.realW = 64;
        this.line = [];

        this.generateLine();
    }
    generateLine(){
        if(this.dir == 0) this.line = [0,1,3];
        else if(this.dir == 1) this.line = [0,1,2,3];
        else if(this.dir == 2) this.line = [0,2];
        else if(this.dir == 3) this.line = [0,3];
    }

    update(){
        if(this.rotate < this.goRotate) this.rotate += 0.1;
        if(Math.floor(this.rotate * 10) === Math.floor(this.goRotate * 10)) this.rotate = this.goRotate;
    }

    draw(){
        ctx.save();
        ctx.translate(this.x * this.width + this.width / 2, this.y * this.width + this.width/ 2);
        ctx.rotate(this.rotate * 90 * Math.PI / 180);
        ctx.translate(-this.width / 2, -this.width / 2);
        ctx.drawImage(this.image, this.dir * this.realW, this.state * this.realW, this.realW, this.realW, 0, 0, this.width, this.width);
        ctx.restore();
    }
}