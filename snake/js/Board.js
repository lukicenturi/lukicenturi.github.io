class Brick{
	constructor(x,y,color){
		this.width = 10;
		this.x = x;
		this.y = y;
		this.color = color;

	}
	draw(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = 'white';
		ctx.rect(this.x * this.width, this.y * this.width, this.width , this.width);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
}