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
			ctx.drawImage(image,this.temp*width,0,width,width,this.x,this.y,width,width);

			ctx.beginPath();
			ctx.fillStyle = 'rgba(255,255,255,0.5)';
			ctx.arc(this.x + (width / 2), this.y + (width / 2), 0.4 * width, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = '#eee';
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.font = "bold 40px Raleway";
			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.fillText( '1', this.x + (width / 2), this.y + 10 + (width / 2));
			ctx.closePath();
		}else{
			ctx.drawImage(image,this.sx*width,0,width,width,this.x,this.y,width,width);
		}
		ctx.restore();
	}
}