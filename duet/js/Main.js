$ = document.querySelector.bind(document),
canvas = $("#canvas"),
ctx = canvas.getContext("2d"),
cw = canvas.width,
ch = canvas.height;


window.onload = init();

function init(){
	game = new Game();
}