class Tile{
    constructor(y,x){
        this.x = x;
        this.y = y;
        this.key = this.y + "|" + this.x;
        this.deg = 0;
        this.line = [];
        this.toDeg = this.deg;
        this.linePos();
    }

    linePos(){
        let deg,x,y;
        for( let i = 0 ; i < 6 ; i ++){
            deg = 60 * i - 90;
            x = ((height / 2 - 5) * Math.cos(deg * Math.PI / 180));
            y = ((height / 2 - 5) * Math.sin(deg * Math.PI / 180));
            linePos.push([deg,x,y]);

            deg = 60 * i;
            x = (width / 2 * Math.cos(deg * Math.PI / 180));
            y = (width / 2 * Math.sin(deg * Math.PI / 180));
            rectPos.push([deg,x,y]);
        }
    }

    update(){
        if(this.deg < this.toDeg) this.deg += 10;
        else if(this.deg > this.toDeg) this.deg -= 10;
    }
    draw(){
        let deg,x,y,x1,y1,x2,y2;
        ctx.save();

        ctx.translate(this.x + topX + (width / 2) , this.y + topY + (height / 2));
        ctx.rotate(this.deg * Math.PI / 180);

        // draw hexagon
        ctx.beginPath();
            for( let i = 0 ; i < 7 ; i++ ){
                x = rectPos[i % 6][1];
                y = rectPos[i % 6][2];
                if(i == 0) ctx.moveTo(x,y);
                else{
                    ctx.lineTo(x,y);
                }
            }

        ctx.closePath();

        ctx.fillStyle = color;
        ctx.strokeStyle= 'black';
        ctx.lineWidth = 10;
        ctx.fill();
        ctx.stroke();

        // draw line
        //more than 1 line
        ctx.strokeStyle = color1;
        ctx.lineWidth = 30;

        if(this.line.length > 1){
            ctx.beginPath();
                this.line.forEach((line, i)=>{
                    x = linePos[line][1];
                    y = linePos[line][2];
                    x2 = x / 3;
                    y2 = y / 3;

                    if(!i){
                        ctx.moveTo(x,y);
                    }
                    else{
                        ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
                    }
                    x1 = x2;
                    y1 = y2;
                });
                ctx.stroke();
            ctx.closePath();
        //less than 1 line
        }
        else if(this.line.length){
            ctx.beginPath();
                ctx.arc(0,0,(height - 120) / 2,0, Math.PI * 2);
                ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
                x = linePos[0][1];
                y = linePos[0][2];
                x1 = x / 1.6;
                y1 = y / 1.6;
                ctx.moveTo(x,y);
                ctx.lineTo(x1,y1);
                ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }
}