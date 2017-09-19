window.onload = function(){
    init();
}

function init(){
    $ = document.querySelector.bind(document),
        canvas = $("#canvas"),
        cw = canvas.width,
        ch = canvas.height,
        ctx = canvas.getContext('2d'),
        ctx.textBaseline = 'middle',
        ctx.textAlign = 'center';

    game = new Main();
}
