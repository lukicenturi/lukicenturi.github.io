window.onload = function(){
	setImage();
	setCanvas();
	config();
	setFirst();
	drag();
	startClick();
}

function setImage(){
	imgtile = new Image();
	imgtile.src = 'img/img.png';
}

function setCanvas(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth - 20;
	cw = canvas.width;
	canvas.height = window.innerHeight - 20;
	ch = canvas.height;
}

function config(){
	name = '';
	level = radius1.value;
	img = '';
	width = 400;
	height = 346;
	isStart = false;
	isPause = false;
	isLose = false;
	isSwap = false;
	closeList = {};
	openList = [];
	tiles = [];
	scores = 0;
	boundaryMap = {};
	scale = 0;
	speed = 10;
	opacity = 1;
	queue = 0;
	cur = 1;
}

function setFirst(){
	ready.classList.add('active');
	gameplay.classList.remove('active');
	over.classList.remove('active');
	name1.focus();
}

function startClick(){
	scale = 3 / (level * 2 + 3);
	name = name1.value;
	ready.classList.remove('active');
	gameplay.classList.add('active');

	var x = (cw / scale / 2) - (400 / 2),
		y = (ch / scale / 2) - (346 / 2);

	centerTile = new Tile({
		x:Math.floor(x),
		y:Math.floor(y),
		sx:3 * width,
		sy:0
	});

	openList.push([centerTile.x, centerTile.y, 1]);
	boundaryMap[centerTile.x + "|" + centerTile.y] = centerTile;

	PlayTile.selectedTile = PlayTile.create({
		x:centerTile.x,
		y:centerTile.y-height,
		ready:true
	});

	PlayTile.swapTile = PlayTile.create({
		x:0,
		y:Math.floor((ch / scale) - height)
	});

	generateTile(level);
	drawTile();

	isStart = true;
}

function drawTile(){
	ctx.clearRect(0,0,cw,ch);
	ctx.save();
	ctx.scale(scale,scale);

	tiles.forEach((tile)=>{
		tile.draw();
	});

	for(var key in boundaryMap){
		boundaryMap[key].draw();
	}

	for(var key in PlayTile.madeTile){
		PlayTile.madeTile[key].draw();
		PlayTile.madeTile[key].lines.forEach(function(line){
			line.draw();
		})
	}

	PlayTile.update();

	ctx.restore();
	requestAnimationFrame(drawTile);
}

function endGame(){
	for(key in PlayTile.madeTile){
		PlayTile.madeTile[key].lines.forEach(function(line){
			if(line.linestate != 'white'){
				line.linestate = 'hidden';
			}
		})
	}
	setTimeout(function(){
		isLose = true;
		gameplay.classList.remove('active');
		over.classList.add('active');
		score.innerHTML = scores;
	}, 5000);
}

window.addEventListener('keydown',function(e){
	if(!isStart || isLose) return;
	a = e.keyCode;
	if(a == 37){
		PlayTile.selectedTile.tr -= 60;
	}else if(a == 39){
		PlayTile.selectedTile.tr += 60;
	}else if(a == 13){
		PlayTile.next();
	}else if(a==83){
		if(isSwap) return;
		PlayTile.swap();
	}
})