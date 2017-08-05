class Cloud{
	constructor(x,y,sx,speed,alpha){
		this.image = new Image();
		this.image.src = 'sprite/cloud.png';
		this.x = x;
		this.y = y;
		this.w = 0.5 * 200;
		this.h = 0.5 * 100;
		this.speed = speed;
		this.alpha = alpha;
		this.pos = {
			x:sx,
			y:0,
			w:200,
			h:100
		}
	}

	animate(){
		this.x -= this.speed / 10;
	}

	draw(){
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(this.image, this.pos.x * this.pos.w, this.pos.y * this.pos.h, this.pos.w, this.pos.h, this.x, this.y, this.w, this.h);
		ctx.globalAlpha = 1.0;
		ctx.restore();
	}
}