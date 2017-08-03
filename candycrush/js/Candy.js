class Candy{
	constructor(opt){
		this.x = opt.x;
		this.y = opt.y;
		this.sx = opt.sx;
		this.targetX = opt.targetX;
		if(this.targetX == undefined) this.targetX = this.x;
		this.targetY = opt.targetY;
		if(this.targetY == undefined) this.targetY = this.y;
		this.temp = null;
	}
	
	draw(){
		ctx.save();
		if(this.sx == -1){
			ctx.beginPath();
			ctx.rect(this.x,this.y,width,width);
			ctx.fillStyle = '#eee';
			ctx.fill();
			ctx.drawImage(image,this.temp*width,0,width,width,this.x,this.y,width,width);
			ctx.closePath();
		}else{
			ctx.drawImage(image,this.sx*width,0,width,width,this.x,this.y,width,width);
		}
		ctx.restore();
	}
}