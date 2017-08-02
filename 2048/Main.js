window.onload = function(){
	init();
}

function init(){
	setConfig();
	board = new Board();
	game = new Game(board);
}

function setConfig(){
	$ = document.querySelector.bind(document);
	$("#gameboard").style.width = Math.min(window.innerWidth - 400, window.innerHeight - 400) + "px";	
	$("#gameboard").style.height = Math.min(window.innerWidth - 400, window.innerHeight - 400) + "px";
	width = parseInt($("#gameboard").style.width.replace('px',''));
	size = 4;
}
window.onkeydown = function(e){
	a = e.keyCode;
	if(a == 37){
		game.move(1);
	}
	else if(a == 38){
		game.move(2);
	}
	else if(a == 39){
		game.move(3);
	}
	else if(a == 40){
		game.move(4);
	}
}

restart.onclick = function(e){
	localStorage.removeItem('board');
	localStorage.removeItem('score');
	location.reload();
}