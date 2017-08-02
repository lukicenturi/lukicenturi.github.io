window.onload = function(){
	init();
}

function init(){
	game = new Game();
}

function startClick(){
	game.start();
	play();
}

function play(){
	game.update();
	game.draw();
	game.miliseconds += 40;
	setTimeout(play,40);
}

playbtn.addEventListener('click', ()=>{
	startClick();
})

document.addEventListener('keyup',function(e){
	if(e.keyCode == 32){
		game.dragon.up();
	}
})
restart.addEventListener('click',()=>{
	location.reload();
})