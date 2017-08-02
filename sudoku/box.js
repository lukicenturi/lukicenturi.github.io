class Box{
	constructor(){
		this.startX = 175;
		this.startY = 100;
		this.width = 50;
	}
	draw(){
		let array = board.current;
		let available = board.toFill;

		ctx.save();
		ctx.fillStyle = 'white';
		ctx.rect(this.startX , this.startY, 9 *this.width, 9* this.width);
		ctx.fill();
		ctx.restore();

		for( let y = 0 ; y < 9 ; y++){
			for (let x = 0 ; x < 9 ; x++){
				ctx.beginPath();
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 1;
				if(available[y+"|"+x]) ctx.fillStyle = 'white';
				else ctx.fillStyle = '#efefef';
				ctx.rect(this.startX + (x * this.width), this.startY + (y * this.width),this.width,this.width);
				ctx.font = "30px Arial";
				ctx.textAlign = 'center';
				let number = '';
				if(array[y][x]!=0){
					number = array[y][x];
				}
				ctx.fill();
				ctx.fillStyle = 'black';
				ctx.stroke();
				ctx.fillText(number, this.startX + (x*this.width) + this.width/2, this.startY + (y * this.width) + this.width - 15);
				ctx.closePath();
			}
		}


		for( let i = 0; i < 3 ; i++){
			for( let j = 0; j < 3; j++){
				ctx.beginPath();
				ctx.strokeStyle = 'red';
				ctx.lineWidth = 3;
				ctx.rect(this.startX + (j * 3 * this.width), this.startY + (i * 3 * this.width), this.width*3 ,this.width*3);
				ctx.stroke();
				ctx.closePath();
			}
		}

	}
}
