class Point {
    constructor({ x = 0, y = 0}, { side = null, color = "gray"} = {}) {
        this.x = x;
        this.y = y;
        this.side = side; //change to owner
        this.color = color;
        this.isTurn = false;
        this.isTarget = false;
        this.isDead = false;
    }

    // getColor() {
    //     if (this.side == 1) {
    //         return this.color = "green"
    //     } else if (this.side == 2) {
    //         return this.color = "red"
    //     } else { return this.color = "gray)" }
    // }

    equals(point) {
        return this.x == point.x && this.y == point.y;
    }

    draw(ctx, { size = 18, outline = false, fill = false } = {}) {
        const rad = size / 2;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
        ctx.fill();
        if (outline) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.arc(this.x, this.y, rad * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
        if (fill) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, rad * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = "yellow"
            ctx.fill();
        }
        if (this.isTurn) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, rad * 0.9, 0, Math.PI * 2);
            ctx.fillStyle = "black"
            ctx.fill();
        }
        if (this.isTarget) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            const lineLength = 20;
            const startX = this.x - lineLength;
            const startY = this.y - lineLength;

            // Draw the X shape
            ctx.beginPath();
            ctx.moveTo(startX, startY);   
            ctx.lineTo(startX + 2 * lineLength, startY + 2 * lineLength);
            ctx.moveTo(startX + 2 * lineLength, startY);
            ctx.lineTo(startX, startY + 2 * lineLength);
            ctx.stroke();
            ctx.closePath();
        }
    }
}