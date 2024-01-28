class StagingArea {  
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.owner = 0;
        // this.color = "black";
    }

    equals(point) {
        return this.x == point.x && this.y == point.y;   
    }

    draw(ctx, { size = 25, color = "gray", outline = false, enemy = false } = {}) {
        //let fillColor;

        // //TODO: this is not working!
        // //const currentUser = firebase.auth().currentUser;
        // //console.log("firebase auth user uid", playerRef)
        // //const currentUser = firebase.database().ref(`players/${playerId}`)
        // //console.log(lobbyId ? lobbyId === players[playerId].currentLobby : false)

        // if (this.owner === firebase.auth().currentUser.uid) {
        //     //console.log("point info", this.owner)
        //     //console.log("server info", players[playerId].id)
        //     fillColor = "green"
        // } else { fillColor = "red" }

        if (!enemy) {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, size, myCanvas.height);
        }
        if (enemy) {
            ctx.fillStyle = color;
            ctx.fillRect(0, myCanvas.width, size, myCanvas.height);
        }
    }
}