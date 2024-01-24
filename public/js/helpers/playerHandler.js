function editPoints() {

    const popUp = document.getElementById("dialog__prompt-points");

    // TODO: Rename the below
    const popUpDetails = getElementDetails("points-display-box");

    const input = document.getElementById("point-modifier");

    if (popUpDetails) {
        // Set position and size styles for the dialog
        popUp.style.top = popUpDetails.top + "px";
        popUp.style.left = popUpDetails.left + "px";
        popUp.style.width = popUpDetails.width + "px";
        popUp.style.height = popUpDetails.height + "px";

        input.value = players[playerId].currentPoints;
        popUp.show();
    }
    // Create a promise and resolve it when the user confirms
    return new Promise(resolve => {
        // Define resolveDialog in the global scope
        window.resolveDialog = function(result) {
        
        popUp.close();

        // Resolve the promise with the user's choice
        resolve(result);

        if (result) {
            
            console.log(`User had ${players[playerId].currentPoints} point(s).`);

            playerRef.update({
                currentPoints: input.value,
            })
            console.log("User's points has been changed to:", players[playerId].currentPoints);
            document.getElementById("points-display").textContent = players[playerId].currentPoints;

            // input.value = 40;

        } else { console.log("Dialog closed without changing points.") }
        };
    });
};

// Same order as sprite sheet - old, need to remove
const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];