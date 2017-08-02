class PlayTile extends Tile{  
	constructor(opt){
		super(opt);
		this.x = opt.x;
		this.y = opt.y;
		this.sx = 3 * 400;
		this.sy = 0;
		this.lines = [];
		this.key = this.x+"|"+this.y;
	}

	generateLine(){
		let index = [0,1,2,3,4,5,6,7,8,9,10,11];

		let indexPoint = [
			[6 / 16 * width, 8 / 8 * height],
			[10 / 16 * width, 8 / 8 * height],
			[13 / 16 * width, 7 / 8 * height],
			[15 / 16 * width, 5 / 8 * height],
			[15 / 16 * width, 3 / 8 * height],
			[13 / 16 * width, 1 / 8 * height],
			[10 / 16 * width, 0 / 8 * height],
			[6 / 16 * width, 0 / 8 * height],
			[3 / 16 * width, 1 / 8 * height],
			[1 / 16 * width, 3 / 8 * height],
			[1 / 16 * width, 5 / 8 * height],
			[3 / 16 * width, 7 / 8 * height]
		];

		let controlPoint = [
			[3 / 8 * width, 3 / 4 * height],
			[5 / 8 * width, 3 / 4 * height],
			[6 / 8 * width, 2 / 4 * height],
			[5 / 8 * width, 1 / 4 * height],
			[3 / 8 * width, 1 / 4 * height],
			[2 / 8 * width, 2 / 4 * height]
		];

		let x = this.x,
			y = this.y;

		while(index.length > 0){
			let startIndex = index.splice(Math.floor(Math.random() * index.length), 1)[0],
				endIndex = index.splice(Math.floor(Math.random() * index.length), 1)[0],

				startPoint = indexPoint[startIndex],
				endPoint = indexPoint[endIndex],

				startControl = controlPoint[Math.floor((startIndex + 1) / 2) % controlPoint.length],
				endControl = controlPoint[Math.floor((endIndex + 1) / 2) % controlPoint.length];
			let v = [
				startPoint,
				startControl,
				endControl,
				endPoint
			]
			this.lines.push(new Line({
				v: v,
				linestate: Line.State.NORMAL,
				key: x+"|"+y,
				point:[startIndex, endIndex]
			}));
		}
	}

	static update(){
		let p = PlayTile.selectedTile;
		let s = PlayTile.swapTile;

		if(p.r < p.tr) p.r += 10;
		else if(p.r > p.tr) p.r -= 10;
		
		if(Math.round(p.targetX) != Math.round(p.x) && Math.round(p.targetY) != Math.round(p.y)){
			if(Math.round(p.targetX != Math.round(p.x))){
				let moveX = (p.targetX - p.fromX) / speed;
				p.x += moveX;
			}
			if(Math.round(p.targetY != Math.round(p.y))){
				let moveY = (p.targetY - p.fromY) / speed;
				p.y += moveY;
			}
		}else{
			p.x = p.targetX;
			p.y = p.targetY;
			p.fromX = p.targetX;
			p.fromY = p.targetY;
		}

		if(Math.round(s.targetX) != Math.round(s.x) && Math.round(s.targetY) != Math.round(s.y)){
			if(Math.round(s.targetX != Math.round(s.x))){
				let moveX = (s.targetX - s.fromX) / speed;
				s.x += moveX;
			}
			if(Math.round(s.targetY != Math.round(s.y))){
				let moveY = (s.targetY - s.fromY) / speed;
				s.y += moveY;
			}
		}else{
			s.x = s.targetX;
			s.y = s.targetY;
			s.fromX = s.targetX;
			s.fromY = s.targetY;
			swap = false;
		}
	}

	static next(){
		let indices = [7,6,9,8,11,10,1,0,3,2,5,4];

		let p = PlayTile.selectedTile;


		var entryIndex = p.entryIndex;
		entryIndex = (entryIndex + (p.r / 30)) % 12;
		if(entryIndex < 0) entryIndex += 12;

		var line = p.lines.find(function(line){
			return line.point.indexOf(entryIndex) != -1;
		});

		queue += 1;
		line.queue = queue;

		var exitPoint = line.point.indexOf(entryIndex);
		var exitIndex = line.point[(exitPoint + 1) % 2];
		exitIndex = (exitIndex - (p.r / 30)) % 12;
		if(exitIndex < 0) exitIndex += 12;

		if(exitPoint == 1){
			line.v.reverse();
		}

		line.linestate = Line.State.SELECTED;

		var nextMap = Tile.getDirection()[Math.floor(exitIndex / 2)],
			nextX = p.x + nextMap[0],
			nextY = p.y + nextMap[1],
			nextKey = nextX+"|"+nextY;

		score ++;

		if(boundaryMap[nextKey]){
			endGame();
		}else if(PlayTile.madeTile[nextKey]){
			PlayTile.selectedTile = PlayTile.madeTile[nextKey];
			PlayTile.selectedTile.entryIndex = indices[exitIndex];
			PlayTile.next();
		}else{
			PlayTile.selectedTile = PlayTile.create({
				x: nextX,
				y: nextY,
				entryIndex: indices[exitIndex]
			})
		}
	}

	static swap(){
		let temp = PlayTile.selectedTile;
		PlayTile.selectedTile = PlayTile.swapTile;
		PlayTile.swapTile = temp;

		let p = PlayTile.selectedTile;
		let s = PlayTile.swapTile;

		p.targetX = s.x;
		p.targetY = s.y;

		s.targetX = p.x;
		s.targetY = p.y;
	
		p.key = p.targetX + "|" + p.targetY;
		s.key = s.targetX + "|" + s.targetY;

		p.lines.forEach(function(line){
			line.key = p.key
		})

		s.lines.forEach(function(line){
			line.key = s.key
		})

		PlayTile.madeTile[p.key] = p;
		PlayTile.madeTile[s.key] = s;


		p.entryIndex = s.entryIndex;
		swap = true;
	}
}

PlayTile.madeTile = {};
PlayTile.selectedTile = null;
PlayTile.swapTile = null;

PlayTile.create = function(opt){
	var tile = new PlayTile(opt);
	PlayTile.madeTile[tile.key] = tile;
	PlayTile.madeTile[tile.key].generateLine();
	return tile;
}
