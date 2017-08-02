class PlayTile extends Tile{
	constructor(opt){
		super(opt);
		this.sx = 4 * width,
		this.sy = 0;
		this.r = opt.r || 0;
		this.tr = opt.tr || 0;
		this.lines = opt.lines || [];
		this.ready = false;
	}

	generateLine(){
		var index = [0,1,2,3,4,5,6,7,8,9,10,11];

		var entryPoint = [
			[ 6 / 16 * width, 8 / 8 * height],
			[ 10 / 16 * width, 8 / 8 * height],
			[ 13 / 16 * width, 7 / 8 * height],
			[ 15 / 16 * width, 5 / 8 * height],
			[ 15 / 16 * width, 3 / 8 * height],
			[ 13 / 16 * width, 1 / 8 * height],
			[ 10 / 16 * width, 0 / 8 * height],
			[ 6 / 16 * width, 0 / 8 * height],
			[ 3 / 16 * width, 1 / 8 * height],
			[ 1 / 16 * width, 3 / 8 * height],
			[ 1 / 16 * width, 5 / 8 * height],
			[ 3 / 16 * width, 7 / 8 * height]
		];

		var controlPoint = [
			[ 3 / 8 * width, 3 / 4 * height],
			[ 5 / 8 * width, 3 / 4 * height],
			[ 6 / 8 * width, 2 / 4 * height],
			[ 5 / 8 * width, 1 / 4 * height],
			[ 3 / 8 * width, 1 / 4 * height],
			[ 2 / 8 * width, 2 / 4 * height]
		];

		var x = this.x,
			y = this.y;

		while(index.length > 0){
			var startIndex = index.splice(Math.floor(Math.random() * index.length),1)[0],
				endIndex = index.splice(Math.floor(Math.random() * index.length),1)[0],
				startPoint = entryPoint[startIndex],
				endPoint = entryPoint[endIndex],
				startControl = controlPoint[Math.floor((startIndex + 1) / 2) % controlPoint.length],
				endControl = controlPoint[Math.floor((endIndex + 1) / 2) % controlPoint.length];

			this.lines.push(new Line({
				x1: startPoint[0],
				y1: startPoint[1],
				x2: startControl[0],
				y2: startControl[1],
				x3: endControl[0],
				y3: endControl[1],
				x4: endPoint[0],
				y4: endPoint[1],
				linestate: 'black',
				key: x+"|"+y,
				point:[startIndex,endIndex]
			}));
		}
	}
}

PlayTile.selectedTile = null;
PlayTile.swapTile = null
PlayTile.madeTile = {};

PlayTile.create = function(opt){
	var tile = new PlayTile(opt);
	PlayTile.madeTile[tile.key] = tile;
	PlayTile.madeTile[tile.key].generateLine();
	return tile;
}



PlayTile.next = function(){
	var nextMap = [7,6,9,8,11,10,1,0,3,2,5,4];

	var p = PlayTile.selectedTile;
	entryIndex = p.entryIndex;
	r = p.r;
	entryIndex = (entryIndex + (r / 30)) % 12;
	if(entryIndex < 0){
		entryIndex = entryIndex + 12;
	}

	var line = p.lines.find(function(line){
		return line.point.indexOf(entryIndex) != -1;
	});

	line.linestate = 'white';

	var exitIndex = line.point.indexOf(entryIndex);
	exitIndex = line.point[(exitIndex + 1)%2];
	exitIndex = (exitIndex - (r / 30)) % 12;
	if(exitIndex < 0){
		exitIndex = exitIndex + 12;
	}

	var nextDir = getDirection()[Math.floor(exitIndex /2 )],
		nextX = p.x + nextDir[0],
		nextY = p.y + nextDir[1],
		nextKey = nextX + "|" + nextY;

	scores ++ ;

	if(boundaryMap[nextKey]){
		endGame();
		return;
	}else if(PlayTile.madeTile[nextKey]){
		PlayTile.selectedTile = PlayTile.madeTile[nextKey];
		PlayTile.selectedTile.entryIndex = nextMap[exitIndex];
		PlayTile.selectedTile.ready = true;
		PlayTile.next();
	}else{
		PlayTile.selectedTile = PlayTile.create({
			x:nextX,
			y:nextY,
			entryIndex:nextMap[exitIndex]
		})
	}
}

PlayTile.update = function(){
	p = PlayTile.selectedTile;
	s = PlayTile.swapTile;

	if(p.r > p.tr) p.r -= 10;
	else if(p.r < p.tr) p.r += 10;

	if(Math.round(p.targetX) != Math.round(p.x) || Math.round(p.targetY) != Math.round(p.y)){
		if(Math.round(p.targetX) != Math.round(p.x)){
			moveX = (p.targetX - p.fromX) / speed;
			p.x += moveX;
		}
		if(Math.round(p.targetY) != Math.round(p.y)){
			moveY = (p.targetY - p.fromY) / speed;
			p.y += moveY;
		}
	}else{
		p.x = p.targetX;
		p.y = p.targetY;
		p.fromX = p.x;
		p.fromY = p.y;
	}

	if(Math.round(s.targetX) != Math.round(s.x) || Math.round(s.targetY) != Math.round(s.y)){
		if(Math.round(s.targetX) != Math.round(s.x)){
			moveX = (s.targetX - s.fromX) / speed;
			s.x += moveX;
		}
		if(Math.round(s.targetY) != Math.round(s.y)){
			moveY = (s.targetY - s.fromY) / speed;
			s.y += moveY;
		}
	}else{
		s.x = s.targetX;
		s.y = s.targetY;
		s.fromX = s.x;
		s.fromY = s.y;
		isSwap = false;
	}

}

PlayTile.swap = function(){
	temp = PlayTile.selectedTile;
	PlayTile.selectedTile = PlayTile.swapTile;
	PlayTile.swapTile = temp;
	
	PlayTile.selectedTile.targetX = PlayTile.swapTile.x;
	PlayTile.selectedTile.targetY = PlayTile.swapTile.y;

	PlayTile.swapTile.targetX = PlayTile.selectedTile.x;
	PlayTile.swapTile.targetY = PlayTile.selectedTile.y;

	PlayTile.selectedTile.entryIndex = PlayTile.swapTile.entryIndex;

	PlayTile.selectedTile.key = PlayTile.selectedTile.targetX +"|" +PlayTile.selectedTile.targetY;
	PlayTile.swapTile.key = PlayTile.swapTile.targetX +"|" +PlayTile.swapTile.targetY;

	PlayTile.selectedTile.lines.forEach(function(line){
		line.key = PlayTile.selectedTile.key;
	});

	PlayTile.swapTile.lines.forEach(function(line){
		line.key = PlayTile.swapTile.key;
	});

	PlayTile.madeTile[PlayTile.selectedTile.key] = PlayTile.selectedTile;
	PlayTile.madeTile[PlayTile.swapTile.key] = PlayTile.swapTile;

	isSwap = true;
}