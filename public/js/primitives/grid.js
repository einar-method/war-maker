class TerrainGrid {
    constructor (x, y, id) {
        this.terrainID = id; //unique number, grid id
        this.size = 60;
        this.rad = this.size / 2;
        this.type //rough, block, cover, open
        this.cord = { x, y };
        this.color = "black";
        this.text = null;
        this.blocksMove = false;
        this.forceInside = [] //usually only one?
        this.inContactWith = [] //terrain or units in contact
    }

    getCenter() {
        return {
            x: this.cord.x,
            y: this.cord.y
        };
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;
        ctx.arc(this.cord.x, this.cord.y, this.rad, 0, Math.PI * 2);
        ctx.stroke();

        // if (fill) {
        //     ctx.beginPath();
        //     ctx.arc(this.x, this.y, rad * 0.4, 0, Math.PI * 2);
        //     ctx.fillStyle = "yellow"
        //     ctx.fill();
        // }
    }
}