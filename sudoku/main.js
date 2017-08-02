window.onload = function(){
	init();
}

canvas.addEventListener('click',function(e){
	getClicked(e.pageX, e.pageY);
});

function init(){
	setCanvas();
	startPlay();
}

function getClicked(x,y){
	let post = canvas.getBoundingClientRect();
	posX = x - post.left - box.startX;
	posY = y - post.top - box.startY;

	x = Math.floor(posX / box.width);
	y = Math.floor(posY / box.width);

	if(!board.toFill[y+"|"+x] || done) return;
	if(board.current[y][x] == 9) board.current[y][x] = 0;
	board.current[y][x] += 1;
	cekdone();
}
function cekdone(){
	for( let i = 0; i < 9 ; i++){
		for (let j = 0; j < 9 ; j++){
			if(board.current[i][j] != board.before[i][j]) return false;
		}
	}
	done = true;
}
function cheat(){
	board.generateNumber(80);
}
function setCanvas(){
	canvas = document.getElementById('canvas');
	canvas.width = 800;
	canvas.height = 600;
	ctx = canvas.getContext('2d');
}
function startPlay(){
	getReady();
	setTimer();
	draw();
}

function getReady(){
	done = false;
	cw = canvas.width;
	ch = canvas.height;
	timer = new Timer();
	board = new Board();
	board.generateBoard();
	box = new Box();
}
function draw(){
	ctx.clearRect(0,0,cw,ch);
	ctx.save();
	timer.draw();
	box.draw();
	ctx.restore();
	requestAnimationFrame(draw);
}

function setTimer(){
	timerset = setInterval(function(){
		timer.value++
	},1000);
}
