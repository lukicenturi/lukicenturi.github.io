class Line{
	constructor(opt){
		this.x1 = opt.x1,
		this.y1 = opt.y1,
		this.x2 = opt.x2,
		this.y2 = opt.y2,
		this.x3 = opt.x3,
		this.y3 = opt.y3,
		this.x4 = opt.x4,
		this.y4 = opt.y4,
		this.point = opt.point;
		this.linestate = opt.linestate;
		this.key = opt.key;
		this.done = opt.done || false;
		this.dash = 0;
	}

	draw(){
		var x = PlayTile.madeTile[this.key].x,
			y = PlayTile.madeTile[this.key].y,
			tx = x + width / 2,
			ty = y + height / 2,
			r = PlayTile.madeTile[this.key].r;

		ctx.save();
		ctx.translate(tx,ty);
		ctx.rotate(r * Math.PI / 180);
		ctx.translate(-width / 2, -height / 2);

		if(this.linestate != 'hidden'){
			ctx.setLineDash([1000,1000000]);

			ctx.beginPath();
			ctx.moveTo(this.x1,this.y1);
			ctx.bezierCurveTo(this.x2,this.y2,this.x3,this.y3,this.x4,this.y4);

			ctx.strokeStyle = "black";
			ctx.lineWidth = 30;
			ctx.stroke();

			if(this.linestate == 'white'){
				if(this.dash < 1000){
					this.dash+=30;
					ctx.setLineDash([this.dash,1000000]);
				}
			}else{
				ctx.setLineDash([1000,1000000]);
			}

			ctx.strokeStyle = this.linestate;
			ctx.lineWidth = 25;
			ctx.stroke();
			ctx.closePath();
	}

		ctx.restore();
	}
}