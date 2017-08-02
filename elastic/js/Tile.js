class Tile{
	constructor(opt){
		this.x = opt.x;
		this.y = opt.y;
		this.sx = opt.sx;
		this.sy = opt.sy;
		this.r = opt.r || 0;
		this.tr = opt.tr || 0;
		this.key = opt.x + "|" + opt.y;
		this.entryIndex = opt.entryIndex || 0;
		this.targetX = opt.targetX || this.x;
		this.targetY = opt.targetY || this.y;
		this.fromX = opt.fromX || this.x;
		this.fromY = opt.fromY || this.y;
	}


	draw(){
		ctx.save();
		ctx.translate(this.x + width / 2, this.y + height / 2);
		ctx.rotate(this.r * Math.PI/ 180);
		ctx.translate(-width / 2, -height / 2 );
		ctx.drawImage(imgtile,this.sx,this.sy,width,height,0,0,width,height);
		ctx.restore();	
	}

	
}


function getDirection(){
	return [
		[0,346],[300,173],[300,-173],[0,-346],[-300,-173],[-300,173]
	];
}

function generateTile(radius){
		var directions = getDirection();

		while(openList.length > 0){
			var pos = openList.splice(0,1)[0];

			directions.forEach((direction)=>{
				var x = pos[0] + direction[0],
					y = pos[1] + direction[1],
					level = pos[2],
					key = x+"|"+y;

				if(key in closeList) return;
				closeList[key] = [x,y];

				if(level <= radius) openList.push([x,y,level+1]);

				if(level > radius){
					boundaryMap[key] = new Tile({
						x:x,
						y:y,
						sx: Math.floor(Math.random() * 5) * width,
						sy: height
					});
				}else{
					tiles.push(new Tile({
						x:x,
						y:y,
						sx: Math.floor(Math.random() * 3) * width,
						sy:0
					}));
				}
			})
		}
	}