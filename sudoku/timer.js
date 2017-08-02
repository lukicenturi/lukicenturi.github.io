class Timer{
	constructor(){
		this.value = 0;
		this.interval = 1000;
	}
	draw(){
		ctx.save();
		ctx.font = '20px Arial';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		if(done == true){
			ctx.fillText(this.value + 's | DONE!!', canvas.width/2, 20);
			clearInterval(timerset);
		}else{
			ctx.fillText(this.value + 's', canvas.width/2, 20);
		}
		ctx.restore();
	}
}