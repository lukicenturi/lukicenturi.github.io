class Main{
    constructor() {

        this.started = false;
        this.over = false;
        this.timer = 0;
        this.size = 8;
        this.width = 600 / 8;
        this.brick = {};
        this.list = {};
        this.level = 0;
        this.openList = [];
        this.closeList = {};
        this.stock = [
            [16, 30, 8, 8],
            [16, 16, 15, 15]
        ];
        this.highscore = [
            [],[]
        ];
        this.dir = [
            [-1, 0], [0, 1], [1, 0], [0, -1]
        ];
        this.button = [
            {
                'y': ch / 2 - 40,
                'w': 100,
                'h': 25,
                'x': cw / 2 + 200,
                'text':'MEDIUM'
            },
            {
                'y': ch / 2 + 20,
                'w': 100,
                'h': 25,
                'x': cw / 2 + 200,
                'text': 'HARD'
            },
            {
                'y': ch / 2,
                'w': 100,
                'h': 25,
                'x': 700 - 50,
                'text': 'RESTART'
            }
        ];

        this.generateList();
        this.start();
        this.update();
        this.listener();
    }


    start(){
        this.checkHighscore();
    }

    generateList(){
        for(let i = 0 ; i < this.size ; i++){
            for(let j = 0 ; j < this.size ; j++){
                this.list[i + "|" + j] = [i,j];
            }
        }
    }

    listener(){
        $("#canvas").addEventListener('click', (e)=>{
            let x = e.offsetX;
            let y = e.offsetY;
            if(!this.started && !this.over){
                let button;
                for(let i = 0 ; i < 2; i++){
                    button = this.button[i];
                    if(x >= button.x && x <= button.x + button.w
                    && y >= button.y && y <= button.y + button.h){
                        this.level = i;
                        this.startClick();
                    }
                }
            }else if(this.started){
                let button = this.button[2];
                if(x >= button.x && x <= button.x + button.w
                    && y >= button.y && y <= button.y + button.h) {
                    this.restart();
                }

                if(!this.over){
                    let sx = Math.floor(x / this.width);
                    let sy = Math.floor(y / this.width);

                    this.click(sx, sy);
                }
            }
        });
    }

    click(x, y){
        if(x < 0 || x >= this.size || y < 0 || y >= this.size) return;

        let brick = this.brick[y + "|" + x];

        if(brick.constructor.name == "PlayTile") return;

        brick.goRotate += 1;

    }

    done(){
        this.over = true;
        this.highscore[this.level].push(this.timer);
        this.highscore = this.highscore.map((highscore) => {
            return highscore.sort((a, b)=>{return a > b});
        });
        localStorage.lukicenturi = JSON.stringify(this.highscore);
    }

    restart(){
        location.reload();
    }

    generateBrick(){
        this.generateSource();
        this.generateTile();
        this.started = true;
    }

    startClick(){
        this.generateBrick();
    }

    generateSource(){
        let x,y,rotate,dir;
        let pipe = [0,1];
        for(let i = 0 ; i < 2; i++){
            x = Math.floor(Math.random() * this.size / 2) + (i * 4);
            y = Math.floor(Math.random() * this.size);

            rotate = Math.floor(Math.random() * 4);

            if(x < 2) rotate = 1;
            if(x > 6) rotate = 3;
            if(y < 2) rotate = 2;
            if(y > 6) rotate = 0;

            dir = pipe.splice(Math.floor(Math.random() * pipe.length), 1)[0];

            delete(this.list[y + "|" + x]);
            this.brick[y + "|" + x] = new PlayTile(y, x, dir, rotate);

            if(!dir){
                PlayTile.source = this.brick[y + "|" + x];
            }else{
                PlayTile.destination = this.brick[y + "|" + x];
            }
        }
    }

    generateTile(){
        let key, pos, x, y, rotate, dir, filter;
        for(let i = 0 ; i < this.size ; i++){
            for(let j = 0 ; j < this.size ; j++){
                key = i + "|" + j;
                if(key in this.list){

                    pos = this.list[key];
                    y = pos[0];
                    x = pos[1];

                    rotate = Math.floor(Math.random() * 4);

                    filter = Object.keys(this.stock[this.level]).filter((stock) => {
                        return this.stock[this.level][stock] > 0
                    });

                    dir = filter[Math.floor(Math.random() * filter.length)];

                    this.stock[this.level][dir] -= 1;

                    this.brick[y + "|" + x] = new Tile(y, x, dir, rotate);
                    delete(this.list[y + "|" + x]);
                }
            }
        }
    }

    checkHighscore(){
        if(localStorage.lukicenturi === undefined){
            localStorage.lukicenturi = JSON.stringify(this.highscore);
        }
        this.highscore = JSON.parse(localStorage.lukicenturi);
    }

    update(){
        this.updateRotate();
        this.draw();
        this.tick();
        this.check();
    }

    draw(){
        ctx.clearRect(0,0,cw,ch);
        ctx.save();

        this.drawButton();
        this.drawHighscore();
        this.drawTile();
        this.drawTimer();
        this.drawOver();

        ctx.restore();

        requestAnimationFrame(this.draw.bind(this));
    }

    drawHighscore(){
        if(!this.started && !this.over){
            let state, sorted;
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.font = "20px Arial";
            ctx.fillText('Highscore : ', 300, 100);
            ctx.closePath();
            for(let i = 0; i < 2; i++){

                if(!i) state = 'MEDIUM';
                else state = 'HARD';

                ctx.beginPath();
                ctx.fillText(state, 200 + i * 200, 150);
                ctx.closePath();
                this.highscore[i].forEach((val, key)=>{
                    if(key < 10){
                        ctx.beginPath();
                        ctx.fillText(key + 1 + ".   " + val + ' s', 200 + i * 200, 200 + key * 30);
                        ctx.closePath();
                     }
                });

            }
        }
    }

    drawTile(){
        if(this.started){
            for(let key in this.brick){
                this.brick[key].draw();
            }
        }
    }

    updateRotate(){
        if(this.started){
            for(let key in this.brick){
                this.brick[key].update();
            }
        }

        setTimeout(()=>{
            this.updateRotate();
        },20);
    }

    setButton(i){
        let button = this.button[i];
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.rect(button.x, button.y, button.w, button.h);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.fillText(button.text, button.x + button.w / 2, button.y + button.h / 2);
        ctx.closePath();
        ctx.restore();
    }

    drawButton(){
        if(!this.started && !this.over){
            let button;
            for(let i = 0 ; i < 2; i++){
               this.setButton(i);
            }
        }else if(this.started){
            this.setButton(2);
        }
    }

    drawOver(){
        if(this.started && this.over){
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.font = "16px Arial";
            ctx.fillText("Game over !", 700, ch / 2 - 50);
            ctx.closePath();
            ctx.restore();
        }
    }

    drawTimer(){
        if(this.started){
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.font = "16px Arial";
            ctx.fillText('Timer : ' + this.timer + "s", 700, ch / 2 - 30);
            ctx.closePath();
            ctx.restore();
        }
    }

    tick(){
        if(this.started && !this.over){
            this.timer++;
        }
        setTimeout(()=>{
            this.tick();
        }, 1000);
    }

    check(){
        if(this.started && !this.over){
            for(let key in this.brick){
                this.brick[key].state = 0;
            }
            this.openList = [];
            this.closeList = {};

            this.openList.push([PlayTile.source.y, PlayTile.source.x]);
            this.flow();
         }
        setTimeout(()=>{
            this.check();
    },20)
    }

    flow(){
        while(this.openList.length > 0){
            let pos = this.openList.splice(0,1)[0],
                key = pos[0] + "|" + pos[1],
                brick = this.brick[key],
                lines = brick.line;

            // if(key in this.closeList) return;

            lines.forEach((line)=>{
                let entryIndex = line + (brick.rotate % 4);
                if(entryIndex > 3) entryIndex -= 4;
                let mustIndex = (entryIndex + 2) % 4,
                    nextDir = this.dir[entryIndex],
                    nextY = nextDir[0] + pos[0],
                    nextX = nextDir[1] + pos[1],
                    nextKey = nextY + "|" + nextX;

                if(nextX < 0 || nextX >= this.size || nextY < 0 || nextY >= this.size || nextKey in this.closeList) return;

                let nextBrick = this.brick[nextKey];

                if(nextBrick.rotate != nextBrick.goRotate) return;

                let nextLines = nextBrick.line,
                    nextEntryIndex = mustIndex - (nextBrick.rotate % 4);
                if(nextEntryIndex < 0) nextEntryIndex += 4;
                let indexOf = nextLines.indexOf(nextEntryIndex) + 1;

                if(indexOf && !this.over){
                    if(nextKey == PlayTile.destination.y + "|" + PlayTile.destination.x){
                        PlayTile.destination.dir = 0;
                        this.done();
                    }else{
                        nextBrick.state = 1;
                    }
                    this.closeList[key] = [];
                    this.openList.push([nextBrick.y, nextBrick.x]);
                }
            });
        }
    }
}
