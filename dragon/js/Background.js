class Background{
	constructor(imgsrc,speed){
		this.image = new Image();
		this.imgsrc = 'image/background/'+imgsrc;
		this.image.src = this.imgsrc;

		this.speed = speed;
		this.desX = null;
		this.desY = 0;

		this.width = 800;
		this.height = 480;

		this.setPos();
	}

	setPos(){
		let type = this.imgsrc[this.imgsrc.split('.')[0].length-1];

		this.desX = 0;
		if(type == 'B'){
			this.desX = cw;
		}
	}

	move(){
		this.desX -= this.speed;
		if(this.desX <= -cw){
			this.desX = cw;
		}
	}

	draw(){
		ctx.save();
		ctx.drawImage(this.image,0,0,this.width,this.height,this.desX, this.desY, this.width,this.height);
		ctx.restore();
	}
}