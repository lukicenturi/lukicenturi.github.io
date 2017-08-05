class Parachute{
	constructor(x,y){
		this.image = new Image();
		this.image.src = 'sprite/parachute.png';
		this.x = x;
		this.w = 0.2 * 245;
		this.h = 0.2 * 324;
		this.y = y;
		this.pos = {
			x:0,
			y:0,
			w:245,
			h:324
		}
	}

	animate(){
		this.y += speed / 5;
	}

	draw(){
		ctx.save();
		ctx.drawImage(this.image, this.pos.x * this.pos.w, this.pos.y * this.pos.h, this.pos.w, this.pos.h, this.x, this.y, this.w, this.h);
		ctx.restore();
	}
}