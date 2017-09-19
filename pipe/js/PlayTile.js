class PlayTile extends Tile{
    constructor(y, x, dir, rotate){
        super(y, x, dir, rotate);
        this.image.src = 'img/source_and_destination.png';

        this.line = [0];
    }
}