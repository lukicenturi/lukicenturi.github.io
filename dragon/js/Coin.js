class Coin{
	constructor(x,y){
		this.image = new Image();
		this.src = 'image/spinning_coin_gold.png';
		this.image.src = this.src;
		this.size = 24;

		this.x = x + cw + 400;
		this.y = y + 120;

		this.sourcePos = {
			x:0,
			y:0,
			w:32,
			h:32
		}

		this.speed = speed;
		this.taken;
	}

	move(){
		this.x -= this.speed;
	}
	animate(){
		this.sourcePos.x ++;
		if(this.sourcePos.x > 8){
			this.sourcePos.x = 0;
		}			
	}	
	draw(){
		ctx.save();
		ctx.drawImage(this.image,this.sourcePos.x*this.sourcePos.w, this.sourcePos.y*this.sourcePos.h, this.sourcePos.w, this.sourcePos.h, this.x, this.y, this.size, this.size);
		ctx.restore();
	}
}