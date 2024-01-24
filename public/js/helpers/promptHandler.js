/************************************************************/
/*         All our dialog prompts and user alerts.          */
/************************************************************/

function promptRemoveUnit(section, forceId) {

    const unit = units[forceId];
    console.log(unit)
    const popUp = document.getElementById("dialog__prompt-main");
    
    popUp.style.top = getCenterScreen(popUp.id);
    popUp.show();

    // Set dialog message
    document.getElementById("dialog__message-main").innerText = `Are you sure you want to remove "${unit.name}" Unit: ${unit.unitID}?`;

    // Create a promise and resolve it when the user confirms
    return new Promise(resolve => {
        // Define resolveDialog in the global scope
        window.resolveDialog = function(result) {
        // Hide overlay and custom dialog
        popUp.close();

        // Resolve the promise with the user's choice
        resolve(result);

        if (result) {
            // Determine cost of unit and refund to owner
            calcPointCost(unit);
            players[playerId].currentPoints += unit.currentCost;
            displayPoints(players[playerId].currentPoints);
            console.log(`${unit.currentCost} points were refunded to ${players[playerId].name}.`);

            // Remove unit from owner's list of units
            removeUnitFromDatabase(unit.unitID);

            //unit.owner.allUnits.splice(unit.owner.allUnits.indexOf(unit), 1);
            // above could still be good for offline

            // Fetch all units associated with the player
            getUnitsForUser(playerId)
                .then((units) => {
                    console.log(`Units associated with player ${players[playerId].name}:`, units);
                    // Update your UI or perform any necessary actions with the fetched units
                })
                .catch((error) => {
                    // Handle error if necessary
                    console.error('Error retrieving units:', error);
                });

            // Finally, remove visible card and set unit to null
            document.getElementById(section).remove();
            //unit = null; // TODO: Do we need this? We had it working before the big card changes
        } else { console.log("Dialog closed without removing unit.") }
        };
    });
};

function fadeInElements(elementIds) {
    requestAnimationFrame(function () {
        elementIds.forEach(function (elementId) {
        // Check the computed style to ensure the initial styles are applied
        window.getComputedStyle(document.getElementById(elementId)).opacity;
  
        // Set opacity to 1 after the initial styles are applied
        document.getElementById(elementId).style.opacity = 1;
      });
    });
};

function callError(txt) {
    document.getElementById("error-txt").innerHTML = txt;
    document.getElementById("error").open = true;
    fadeInElements(["error"])
    setTimeout(() => {
        document.getElementById("error").open = false;
        dialogFade(document.getElementById("error"), 0)
    }, 3000);
};

function callTip(txt) {
    document.getElementById("tip-txt").innerHTML = txt;
    document.getElementById("tip").open = true;
    fadeInElements(["tip"])
    setTimeout(() => {
        document.getElementById("tip").open = false;
        dialogFade(document.getElementById("tip"), 0)
    }, 3000);
};

