class Ball{
	constructor(color, deg){
		this.color = color;
		this.deg = deg;
		this.rad = 10;
		this.distance = 80;
		this.pivot = {
			x : cw / 2,
			y : ch - this.distance - 20
		};
	}

	draw(){
		ctx.save();
		let deg = this.deg * Math.PI / 180;
		let x = this.distance * Math.cos(deg) + this.pivot.x;
		let y = this.distance * Math.sin(deg) + this.pivot.y;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(x,y,this.rad,0, 360*Math.PI / 180);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}