function handleArrowPress(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    if (!isSolid(newX, newY)) {
    //move to the next space
    players[playerId].x = newX;
    players[playerId].y = newY;
    if (xChange === 1) {
        players[playerId].direction = "right";
    }
    if (xChange === -1) {
        players[playerId].direction = "left";
    }
    playerRef.set(players[playerId]);
    }
};