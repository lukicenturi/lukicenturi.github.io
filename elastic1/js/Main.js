window.onload = init();

function init(){
	setCanvas();
	setImage();
	setConfig();
	startPlay();
	listener();
}

function setCanvas(){
	$ = document.querySelector.bind(document);
	canvas.width = window.innerWidth - 20;
	canvas.height = window.innerHeight - 20;
	cw = canvas.width;
	ch = canvas.height;	
	ctx = canvas.getContext('2d');
}

function setImage(){
	imgtile = new Image();
	imgtile.src = 'img/img.png';	
}

function setConfig(){
	width = 400;
	height = 346;
	name = name1.value;
	radius = radius1.value;
	scale = (ch / 350) / (radius * 2 + 3);
	openList = [];
	closeList = {};
	boundaryMap = {};
	tiles = [];
	swap = false;
	rotate = false;
	start = false;
	lose = false;
	score = 0;
	speed = 10;
	queue = 0;
	cur = 1;
	dashSpeed = 30;
}

function startPlay(){
	ready.classList.remove('active');
	gameplay.classList.add('active');
	start = true;

	let x = Math.round((cw / scale / 2) - (width / 2)),
		y = Math.round((ch / scale / 2) - (height / 2));

	centerTile = new Tile({
		x: x,
		y: y,
		sx: 4 * width,
		sy: 0
	});

	openList.push([centerTile.x, centerTile.y, 1]);
	boundaryMap[centerTile.x +"|"+ centerTile.y] = centerTile;

	PlayTile.selectedTile = PlayTile.create({
		x: x,
		y: y - height,
	})

	PlayTile.swapTile = PlayTile.create({
		x: 0,
		y: Math.round((ch / scale) - height),
	})

	Tile.generateTile(radius);
	drawTile();
}

function drawTile(){
	ctx.clearRect(0,0,cw,ch);
	ctx.save();
	ctx.scale(scale,scale);

	PlayTile.update();
	
	tiles.forEach(function(tile){
		tile.draw();
	})

	for(let key in boundaryMap){
		boundaryMap[key].draw();
	}

	for(let key in PlayTile.madeTile){
		PlayTile.madeTile[key].draw();
		PlayTile.madeTile[key].lines.forEach(line=>{
			line.draw();
		})
	}


	ctx.restore();

	requestAnimationFrame(drawTile);
}

function listener(){
	window.addEventListener('keydown',function(e){
		if(start && !lose){
			a = e.keyCode;
			if(a == 37){
				PlayTile.selectedTile.tr -= 60;
			}else if(a == 39){
				PlayTile.selectedTile.tr += 60;
			}else if(a == 13){
				PlayTile.next();
			}else if(a == 83){
				if(!swap)
				PlayTile.swap();
			}
		}
	})

	restart.onclick = function(){
		location.reload();
	}
}

function endGame(){
	lose = true;
	for(let key in PlayTile.madeTile){
		PlayTile.madeTile[key].lines.forEach(function(line){
			if(line.linestate != Line.State.SELECTED) line.linestate = Line.State.HIDDEN								
		})
	}
	setTimeout(function(){
		score1.innerHTML = score;
		gameplay.classList.remove('active');
		over.classList.add('active');
	},3000)	
}

function save(){
	
}