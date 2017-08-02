class Line{
	constructor(opt){
		this.v = opt.v;
		this.key = opt.key;
		this.linestate = opt.linestate;
		this.point = opt.point;
		this.length = Math.ceil(Tile.lineLength(this.v));
		this.dash = 0;
		this.queue = 0;
		this.done = false;
	}

	draw(){
		let parent = PlayTile.madeTile[this.key],
			tx = parent.x + (width / 2),
			ty = parent.y + (height / 2),
			r = parent.r;

		ctx.save();
		ctx.translate(tx,ty);
		ctx.rotate(r * Math.PI / 180);
		ctx.translate(width / -2, height / -2);

		ctx.beginPath();
		ctx.moveTo(this.v[0][0], this.v[0][1]);
		ctx.bezierCurveTo(this.v[1][0], this.v[1][1], this.v[2][0], this.v[2][1], this.v[3][0], this.v[3][1]);

		if(this.linestate != Line.State.HIDDEN){
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 30;
			ctx.stroke();

			ctx.lineWidth = 25;

			if(this.linestate == Line.State.SELECTED){
				ctx.strokeStyle = 'white';
				if(this.dash < this.length){
					if( this.queue == cur ){
						this.dash += dashSpeed;
						ctx.setLineDash([this.dash,100000]);
					}else{
						ctx.setLineDash([0,100000]);
					}
				}else{
					if(!this.done){
						this.done = !this.done;
						cur += 1; 
					}
				}
				ctx.stroke();
			}
			else{
				ctx.strokeStyle = 'black';
				ctx.stroke();
			}

		}
		ctx.restore();
	}
}

Line.State ={
	get NORMAL() { return 0 },
	get SELECTED() { return 1 },
	get HIDDEN() { return 2}
}