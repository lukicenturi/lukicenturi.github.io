// flying score class
class Score extends SkyObject{
    constructor(x, y, score){
        let color = score < 0 ? 'red' : 'green';
        let sign = score < 0 ?  '' : '+';
        super(`<div class='score animation ${color}'>${sign}${score}</div>`);

        this.x = x;
        this.y = y;
        this.sy = -2;
    }
}