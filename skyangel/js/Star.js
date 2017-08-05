class Star{
	constructor(x,y){
		this.image = new Image();
		this.image.src = 'sprite/stars.png';
		this.x = x;
		this.w = 0.3 * 100;
		this.h = 0.3 * 100;
		this.y = y;
		this.pos = {
			x:0,
			y:0,
			w:100,
			h:100
		}
	}

	animate(){
		this.pos.x ++;
		if(this.pos.x >= 7) this.pos.x = this.pos.x % 7;

		this.y += speed / 5;
	}

	draw(){
		ctx.save();
		ctx.drawImage(this.image, this.pos.x * this.pos.w, this.pos.y * this.pos.h, this.pos.w, this.pos.h, this.x, this.y, this.w, this.h);
		ctx.restore();
	}
}