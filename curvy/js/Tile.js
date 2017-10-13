class Tile{
    constructor(y,x){
        this.x = x;
        this.y = y;
        this.key = this.y + "|" + this.x;
        this.deg = 0;
        this.line = [];
        this.toDeg = this.deg;
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

                deg = 60 * i;
                x = (width / 2 * Math.cos(deg * Math.PI / 180));
                y = (width / 2 * Math.sin(deg * Math.PI / 180));

                if(i == 0) ctx.moveTo(x,y);
                else{
                    ctx.lineTo(x,y);
                }
            }

            ctx.fillStyle = 'white';
            ctx.strokeStyle= 'black';
            ctx.lineWidth = 10;
            ctx.fill();
            ctx.stroke();

        ctx.closePath();

        // draw line
        //more than 1 line
        if(this.line.length > 1){
            ctx.beginPath();
            this.line.forEach((line, i)=>{
                deg = 60 * line - 90;
                x = ((height / 2 - 5) * Math.cos(deg * Math.PI / 180));
                y = ((height / 2 - 5) * Math.sin(deg * Math.PI / 180));
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
            ctx.strokeStyle = '#990000';
            ctx.lineWidth = 30;
            ctx.stroke();
            ctx.closePath();
        //less than 1 line
        }
        else if(this.line.length){

            ctx.beginPath();
            ctx.arc(0,0,(height - 120) / 2,0, Math.PI * 2);
            ctx.strokeStyle = '#990000';
            ctx.lineWidth = 30;
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
                let deg = 60 * this.line[0] - 90;
                x = ((height / 2 - 5) * Math.cos(deg * Math.PI / 180));
                y = ((height / 2 - 5) * Math.sin(deg * Math.PI / 180));
                x1 = x / 1.6;
                y1 = y / 1.6;
                ctx.moveTo(x,y);
                ctx.lineTo(x1,y1);
                ctx.strokeStyle = '#990000';
                ctx.lineWidth = 30;
                ctx.stroke();
            ctx.closePath();

        }

        ctx.restore();
    }
}