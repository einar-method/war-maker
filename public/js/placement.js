// pointsArr.push(...Array(p1Points).fill().map(() => {
//     const newPoint = new Point({});
//     checkGrid(newPoint, { side: 1, color: "green" });
//     return newPoint;
// }));

// pointsArr.push(...Array(p2Points).fill().map(() => {
//     const newPoint = new Point({});
//     checkGrid(newPoint, { side: 2, color: "red" });
//     return newPoint;
// }));

const autoPlacement = (obj) => {
    obj.cord = checkGrid(obj); // pure random, no repeats
    pointsArr.push(new Point(obj.cord, { side: obj.side, color: obj.color}))
}

const canvas = document.getElementById("myCanvas");
let isManualPlacementInProgress = false;

const manualPlacement = async (currentForce) => {
    if (isManualPlacementInProgress) {
        // Ignore the click if manual placement is already in progress
        return Promise.resolve();
    }

    isManualPlacementInProgress = true;

    console.log(`${currentForce.commander.name} has manually placed Unit: ${currentForce.unitID}`);

    return new Promise((resolve) => {
        // Add an event listener for the mouse click event on the canvas
        const handleMouseClick = async (event) => {
            // Remove the event listener to avoid capturing additional clicks
            canvas.removeEventListener('click', handleMouseClick);

            // Implement your logic to check if the click is valid
            const isValidClick = true; // Replace with your actual logic

            if (isValidClick) {
                // Additional code for processing the mouse click event...

                // Reset the flag to allow the next manual placement
                isManualPlacementInProgress = false;

                // Resolve the promise to signal the completion of manual placement
                resolve();
            }
        };

        // Attach the event listener for the mouse click event on the canvas
        canvas.addEventListener('click', handleMouseClick);
    });
};



// p1.battleOrder, p2.battleOrder, p1.battleForces, p2.battleForces
const takeTurns = async (p1Ord, p2Ord, p1Units, p2Units) => {
    const aggressor = Math.min(p1Ord, p2Ord);
    console.log("Battle Agr:", aggressor);

    const players = [
        { name: 'p1', units: p1Units.slice() },
        { name: 'p2', units: p2Units.slice() }
    ];

    let currentPlayerIndex = aggressor === p1Ord ? 0 : 1;

    while (players.some(player => player.units.length > 0)) {
        const currentPlayer = players[currentPlayerIndex];
        const currentForce = currentPlayer.units.shift();

        if (currentForce) {
            await placementDispatcher(currentForce, currentPlayer);
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    console.log("Turns completed.");
};

const placementDispatcher = async (currentForce, currentPlayer) => {
    return new Promise(async (resolve) => {
        if ((currentPlayer.name === 'p1' && isP1Automated) || (currentPlayer.name === 'p2' && isP2Automated)) {
            // Simulate asynchronous placement for automated player
            setTimeout(async () => {
                autoPlacement(currentForce);
                resolve();
            }, 1000); // Adjust the timeout as needed
        } else {
            // Manual placement (to be implemented)
            await manualPlacement(currentForce);
            resolve();
        }
    });
};