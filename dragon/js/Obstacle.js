class Obstacle{
	constructor(x,y,imgsrc){
		this.width = 40;
		this.height = 150;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.sourcePos = {
			x:0,
			y:0,
			w:66,
			h:149
		}
		this.crash = false;
		this.image = new Image();
		this.imgsrc = imgsrc;
		this.image.src = imgsrc;
	}

	move(){
		this.x -= this.speed;
	}

	draw(){
		ctx.save();
		ctx.drawImage(this.image,this.sourcePos.x,this.sourcePos.y,this.sourcePos.w,this.sourcePos.h,this.x,this.y,this.width,this.height);
		ctx.restore();
	}
}