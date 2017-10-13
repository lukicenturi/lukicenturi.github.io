window.onload = init();

function init(){
    setCanvas();
    setProp();
    cekLocal();
    setScale();
    setUsed();
    start();
}

function cekLocal(){
    if(localStorage.curvy_length === undefined){
        localStorage.curvy_length = JSON.stringify([hor,ver]);
    }
    curvy_length = JSON.parse(localStorage.curvy_length);
    hor = +curvy_length[0];
    ver = +curvy_length[1];
    ho.value = hor > 50 ? 50 : hor < 2 ? 2 : hor;
    ve.value = ver > 50 ? 50 : ver < 2 ? 2 : ver;
}

function setCanvas(){
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 40;
    cw = canvas.width;
    ch = canvas.height;
    ctx = canvas.getContext('2d');
}

function setProp(){
    win = false;
    width = 400;
    height = 346;
    hor = 4;
    ver = 4;
    tiles = {};
    dir = [
        [0, -346], [300, -173], [300, 173], [0, 346], [-300, 173], [-300, -173]
    ];
}

function setScale(){
    w = width + (0.75 * width * ( hor - 1 )) + (0.25 * width);
    h = height * ( ver + 0.5 );
    scale = Math.min(cw / w, ch / h);
}

function start(){
    generateTile();
    generateSolve();
    randomRotate();
    drawTile();
}
function check(){
    let state = true;
    for ( let key in tiles ){
        tiles[key].line.forEach((line)=>{
            if(tiles[key].deg != tiles[key].toDeg){
                state = false;
                return;
            }
            line = (line + (tiles[key].deg / 60)) % 6;
            if(line < 0) line += 6;

            let nextX = tiles[key].x + dir[line][0];
            let nextY = tiles[key].y + dir[line][1];
            let nextKey = nextY + "|" + nextX;
            let mustHave = (line + 3) % 6;

            if(Object.keys(tiles).indexOf(nextKey) == -1){
                state = false;
                return;
            }

            let nextBrick = tiles[nextKey];

            if(nextBrick.deg != nextBrick.toDeg){
                state = false;
                return;
            }

            mustHave = (mustHave - (nextBrick.deg / 60)) % 6;
            if(mustHave < 0) mustHave += 6;

            if(nextBrick.line.indexOf(mustHave) == -1){
                state = false;
                return;
            }

        });
    }

    if(state) {
        win = true;
        // setTimeout(()=>{
        //     alert("Game Done!!");
        //     location.reload();
        // }, 1000);
    }

}

function generateTile(){
    for(i = 0 ; i < hor ; i++){
        x = 0;
        if(i) x = i * 0.75 * width;
        for(j = 0 ; j < ver ; j++){
            y = j * height + (i % 2) / 2 * height;
            tiles[y + "|" + x] = new Tile(y,x);
        }
    }
}

function setUsed(){
    w = (width + (0.75 * width * ( hor - 1 )));
    h = (height * ( ver + 0.5 ));
    topX = (cw / scale - w) / 2;
    topY = (ch / scale - h) / 2;
}

function generateSolve(){
    let array = [], dist = [];

    for(let key in tiles){
        for(let i = 0 ; i < 6 ; i++ ){
            if(array.indexOf(key + "-" + i) == -1){
                let nextX = tiles[key].x + dir[i][0];
                let nextY = tiles[key].y + dir[i][1];
                let nextKey = nextY + "|" + nextX;

                if(nextKey in tiles){
                    let nextLine = (i + 3) % 6;
                    array.push(key + "-" + i);
                    array.push(nextKey + "-" + nextLine);
                }
            }
        }
    }
    let sum = Math.ceil(Math.random() * array.length * 0.2) + Math.floor(array.length * 0.6);

    for( i = 0  ; i < sum/2 ; i++ ){
        let a = array.splice(Math.floor(Math.random() * array.length / 2) * 2, 2);
        let key1 = a[0];
        let key2 = a[1];

        key1 = key1.split("-");
        key2 = key2.split("-");

        tiles[key1[0]].line.push(+key1[1]);
        tiles[key2[0]].line.push(+key2[1]);
    }


    for(let key in tiles){
        tiles[key].line.sort();
        array = [];
        dist = [];


        if(tiles[key].line.length > 1){

            for(let i = 0, len = tiles[key].line.length ; i < len ; i++){
                dist[i] = [];
                array[i] = tiles[key].line.slice(0);
                for(let j = 0 ; j < i ; j++){
                    array[i].push(6 + array[i].splice(0,1)[0]);
                }
                array[i].forEach((line, j)=>{
                    if( j < array[i].length - 1){
                        dist[i].push(array[i][j + 1] - line);
                    }
                });
            }

            let max = Infinity;
            let index = 0;
            const add = (a,b) => a + b;
            dist.forEach((dis, i)=>{
                let sum = dis.reduce(add);
                if(sum < max){
                    index = i;
                    max = sum;
                }
            });

            tiles[key].line = array[index];

            tiles[key].line.forEach((line, i)=>{
                tiles[key].line[i] %= 6;
            });
        }
    }
}

function rotate(x,y){
    if(win) return false;
    let array = [];
    let temp;

    x = x / scale - topX;
    y = y / scale - topY;

    for( let key in tiles ){
        temp = tiles[key];

        if(temp.x <= x && temp.x + width >= x
            && temp.y <= y && temp.y + height >= y){
            array.push(temp);
        }
    }

    array.sort((a,b)=>{
        return Math.hypot(a.x + width / 2 - x, a.y + height / 2 - y) > Math.hypot(b.x + width / 2 - x, b.y + height / 2 - y);
    });

    if(array.length) array[0].toDeg += 60;
}

function randomRotate(){
    for(let key in tiles){
        tiles[key].deg = Math.floor(Math.random() * 6) * 60;
        tiles[key].toDeg = tiles[key].deg;
    }
}

function drawTile(){
    if(win) return false;
    ctx.clearRect(0,0,cw,ch);
    ctx.save();
    ctx.scale(scale, scale);

    for(let key in tiles){
        tiles[key].update();
        tiles[key].draw();
    }
    ctx.restore();

    check();

    requestAnimationFrame(drawTile);
}
window.addEventListener('resize',(e)=>{
    setCanvas();
    setScale();
    setUsed();
});

canvas.addEventListener('click',(e)=>{
    let x = e.offsetX;
    let y = e.offsetY;

    rotate(x,y);

});
canvas.addEventListener('touchstart',(e)=>{
    let x = e.changedTouches.clientX;
    let y = e.changedTouches.clientY;

    rotate(x,y);
});

toggle.addEventListener('click',(e)=>{
    float.classList.toggle('active');
});

restart.addEventListener('click',(e)=>{
    curvy_length = [ho.value > 50 ? 50 : ho.value < 2 ? 2 : ho.value, ve.value > 50 ? 50 : ve.value < 2 ? 2 : ho.value];
    localStorage.curvy_length = JSON.stringify(curvy_length);

    location.reload();
});

ho.addEventListener('keydown', (e)=>{
    if(e.keyCode == 13) ve.focus();
});

ve.addEventListener('keydown', (e)=>{
    if(e.keyCode == 13) restart.click();
})