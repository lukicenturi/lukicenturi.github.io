class Bird{
	constructor(x,y,speed){
		this.image = new Image();
		this.image.src = 'sprite/bird.png';
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.w = 0.15 * 427;
		this.h = 0.15 * 291;
		this.pos = {
			x:0,
			y:0,
			w:427,
			h:291
		}
	}

	animate(){
		this.pos.x ++;
		if(this.pos.x >= 8) this.pos.x = this.pos.x % 8;

		this.x -= this.speed / 5;
	}

	draw(){
		ctx.save();
		ctx.drawImage(this.image, this.pos.x * this.pos.w, this.pos.y * this.pos.h, this.pos.w, this.pos.h, this.x, this.y, this.w, this.h);
		ctx.restore();
	}
}