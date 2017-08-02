class Tile{
	constructor(opt){
		this.x = opt.x;
		this.y = opt.y;
		this.sx = opt.sx;
		this.sy = opt.sy;
		this.r = opt.r || 0;
		this.tr = opt.tr || 0;
		this.key = this.x+"|"+this.y;
		this.entryIndex = opt.entryIndex || 0;
		this.targetX = this.x;
		this.targetY = this.y;
		this.fromX = this.x;
		this.fromY = this.y;
	}

	draw(){
		ctx.save();
		ctx.translate(this.x + (width / 2), this.y + (height / 2));
		ctx.rotate(this.r * Math.PI / 180);
		ctx.translate(width / -2, height / -2);
		ctx.drawImage(imgtile,this.sx,this.sy,width,height,0,0,width,height);
		ctx.restore();
	}

	static getDirection(){
		return [
			[0,346], [300,173], [300, -173], [0, -346], [-300, -173], [-300, 173]
		];
	}

	static generateTile(){
		let directions = Tile.getDirection();

		while(openList.length > 0){
			let pos = openList.splice(0,1)[0];

			directions.forEach(function(direction){
				let x = pos[0] + direction[0],
					y = pos[1] + direction[1],
					level = pos[2],
					key = x+"|"+y;

				if(key in closeList) return;
				closeList[key] = [x,y];

				if(level <= radius) openList.push([x,y,level+1]);

				if(level > radius){
					boundaryMap[key] = new Tile({
						x: x,
						y: y,
						sx: Math.floor(Math.random() * 5) * width,
						sy: height
					})
				}else{
					tiles.push(new Tile({
						x: x,
						y: y,
						sx: Math.floor(Math.random() * 3) * width,
						sy: 0
					}))
				}
			})
		}
	}

	static lineLength(v){
		return Tile.distance(v[0], v[1]) + Tile.distance(v[1], v[2]) + Tile.distance(v[2], v[3]);	
	}

	static distance(p1, p2){
		return Math.sqrt(Math.pow(p1[0] - p2[0],2 ) + Math.pow(p1[1] - p2[1], 2));		
	}
}