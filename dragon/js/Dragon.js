class Dragon{
	constructor(){
		this.x = 30;
		this.y = ch / 2 - 50;
		this.image = new Image();
		this.imgsrc = 'image/dragon.png';
		this.image.src = this.imgsrc;
		this.speed = speed;

		this.width = 100;
		this.height = 100;

		this.sourcePos = {
			x:0,
			y:0,
			w:256,
			h:256
		}
		this.goUp = false;
		this.gap = 0;
	}

	animate(){

		this.sourcePos.x ++ ;
		if(this.sourcePos.x >= 6 && this.sourcePos.y == 0){
			this.sourcePos.x = 0;
			this.sourcePos.y++;
		}
		if(this.sourcePos.x >= 6 && this.sourcePos.y == 1){
			this.sourcePos.x = 0;
			this.sourcePos.y = 0;
		}
		if(this.gap == 0){
			this.y += 5;
		}else{
			this.gap--;
			this.y -= 4; 
		}
	}
	up(){
		this.gap = 10;
	}
	draw(){
		ctx.save();
		ctx.drawImage(this.image,this.sourcePos.x * this.sourcePos.w, this.sourcePos.y * this.sourcePos.h, this.sourcePos.w, this.sourcePos.h, this.x, this.y, this.width, this.height);
		ctx.restore();	
	}
}