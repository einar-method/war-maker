class Point2 {  
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.key = 0;
        this.owner = 0;
        this.color = "black";
    }

    equals(point) {
        // The following sets ensure a user who does not own the point can't place a point in same place.
        // User hover select distance settings already handle the owner.
        const xArea = new Set(Array.from({ length: 31 }, (_, i) => point.x - 15 + i));
        const yArea = new Set(Array.from({ length: 31 }, (_, i) => point.y - 15 + i));

        return xArea.has(this.x) && yArea.has(this.y);
        //return this.x == point.x && this.y == point.y; // old was working, keeping for ref 
    }

    draw(ctx, { size = 18, color = "black", outline = false, fill = false } = {}) {
        // //TODO: now that we fixed the owner update, would the color work here?
        // //const currentUser = firebase.auth().currentUser;
        // //console.log("firebase auth user uid", playerRef)
        // //const currentUser = firebase.database().ref(`players/${playerId}`)
        // //console.log(lobbyId ? lobbyId === players[playerId].currentLobby : false)

        // if (this.owner === firebase.auth().currentUser.uid) {
        //     //console.log("point info", this.owner)
        //     //console.log("server info", players[playerId].id)
        //     fillColor = "green"
        // } else { fillColor = "red" }

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
    }
}