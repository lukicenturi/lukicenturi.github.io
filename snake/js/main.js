window.onload = init();

function init(){
	setCanvas();
	$(".container-flex").removeClass('active');
	$("#ready").addClass('active');
	if(typeof(localStorage.highscore) == 'undefined')localStorage.highscore = 0;
	highscore1.innerHTML = localStorage.highscore;
	game = new Game();
	draw();
}
function draw(){
	if(game.started){
		ctx.clearRect(0,0,cw,ch);
		game.update();
		game.draw();
	}
	setTimeout(function(){
		game.miliseconds += 20;
		draw();
	},20);
}
function setCanvas(){
	canvas = document.getElementById('canvas');
	canvas.width = 700;
	canvas.height = 500;
	cw = 700;
	ch = 500;
	ctx = canvas.getContext('2d');
}

start.addEventListener('click',function(){
	game.start();
});

restart.addEventListener('click',function(){
	location.reload();
})

document.onkeyup = function(e){
	a = e.keyCode;
	if(a == 38 && game.direction!= 3) game.direction = 1;
	if(a == 39 && game.direction!= 4) game.direction = 2;
	if(a == 40 && game.direction!= 1) game.direction = 3;
	if(a == 37 && game.direction!= 2) game.direction = 4;
}