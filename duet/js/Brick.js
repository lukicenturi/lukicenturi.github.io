class Brick{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw(){
		ctx.save();	
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}