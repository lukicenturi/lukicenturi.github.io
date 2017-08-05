class Plane{
	constructor(){
		this.image = new Image();
		this.image.src = 'sprite/airplane.png';
		this.x = 20;
		this.y = 200;
		this.w = 120;
		this.h = 60;
		this.pos = {
			x:0,
			y:0,
			w:308,
			h:145
		}
	}

	move(key){
		switch(key){
			case 38 : 
				if(this.y > 10){
					this.y -= 20;
				}
				break;
			case 39 : 
				if(this.x + this.w <= 780){
					this.x += 20;
				}
				break;
			case 40 : 
				if(this.y + this.h <= 470){
					this.y += 20;
				}
				break;
			case 37 : 
				if(this.x > 10){
					this.x -= 20;
				}
				break;
		}
	}

	draw(){
		ctx.save();
		ctx.drawImage(this.image, this.pos.x * this.pos.w, this.pos.y * this.pos.h, this.pos.w, this.pos.h, this.x, this.y, this.w, this.h);
		ctx.restore();
	}
}