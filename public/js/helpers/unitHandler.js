// Simple add unit function. TODO: need to handle errors 
function addUnitForDatabase (unit) {
    return database.ref('units/' + unit.unitID).set(unit);
};

function beginForceCreation() {

    if (players[playerId].currentPoints >= 3) { // Previously p1.currentPoints 
        const unit = new Force();

        // Firebase
        unit.owner = playerId; // Assign the user ID
        addUnitForDatabase(unit)
            .then(() => {

                // Set up onDisconnect for the new unit
                const unitRef = firebase.database().ref(`units/${unit.unitID}`);
                unitRef.onDisconnect().remove(); // Remove unit when the user disconnects
            
            })
            .catch(error => {
                console.error('Error adding force:', error);
            });
    
    } else { 
        alert("Not enough points to create a unit. Points remaining: " + players[playerId].currentPoints)
        console.log("Unit creation failed");
        console.log("Points remaining:", players[playerId].currentPoints);
    } 
};

function removeUnitFromDatabase(unitId) {
    const unitRef = firebase.database().ref(`units/${unitId}`);

    // Remove the unit from the database
    return unitRef.remove()
        .then(() => {
            console.log(`Unit ${unitId} removed successfully`);
        })
        .catch(error => {
            console.error(`Error removing unit ${unitId}:`, error);
        });
};
  
// Get all units for a specific user
function getUnitsForUser(userId) {
    const unitsRef = firebase.database().ref('units').orderByChild('owner').equalTo(userId);

    // Return a promise that resolves with the fetched units
    return unitsRef.once('value')
        .then((snapshot) => {
            return snapshot.val();
        })
        .catch((error) => {
            console.error('Error fetching units:', error);
            throw error; // Rethrow the error to be caught by the caller
        });
};

function updateUnitOnServer(unit) {
    const unitRef = firebase.database().ref(`units/${unit.unitID}`);

    // Update the server-side data
    unitRef.update({
        name: unit.name,
        types: unit.types,
        reserveCount: unit.reserveCount,
        //imageSrc: unit.imageSrc,
        unitDice: unit.unitDice,
        abilities: unit.abilities,
        isTurn: unit.isTurn,
        isDead: unit.isDead,
        isCovered: unit.isCovered,
        isSlowed: unit.isSlowed,
        attackRange: unit.attackRange,
        maxAbilities: unit.maxAbilities,
        pastCost: unit.pastCost,
        currentCost: unit.currentCost,
        notes: unit.notes,
    })
    .then(() => {
        console.log(`Unit ${unit.unitID} updated on the server successfully`);
    })
    .catch(error => {
        console.error(`Error updating unit ${unit.unitID} on the server:`, error);
    });
};

function getCurrentType(unit) {
    let current;
    unit.types.forEach(type => {
        if (type.isType) {
            current = type;
        }
    });
    return current;
};

function getCurrentAbilities(unit) {
    // Filter abilities with hasAbility set to true
    const matching = units[unit.unitID].abilities.filter(ability => ability.hasAbility == true);

    // Take the first three matching abilities
    const temp = matching.slice(0, 3);
    const a = temp[0] ? temp[0] : { name: "" };
    const b = temp[1] ? temp[1] : { name: "" };
    const c = temp[2] ? temp[2] : { name: "" };

    return [ a, b, c ]
};

function changeType(type, unit) {
    const state = unit.types.map(obj => ({ ...obj }));

    unit.types.forEach(function(obj) {
        if (obj.name != type.name) {
            obj.isType = false;
            console.log("Changed " + obj.name + " to:", obj.isType);
        } else { 
            obj.isType = true;
            console.log("Changed " + obj.name + " to:", obj.isType);
        }
    });
    
    if (calcPointCost(unit)) {
        console.log("There were enough points for calculation.")
        
        //updateUnitOnServer(unit);
    } else if (!calcPointCost(unit)) {
        unit.types.forEach(function(obj, index) {
            obj.isType = state[index].isType;
            console.log("Reverted " + obj.name + " to:", state[index].isType);
        });
        calcPointCost(unit);
        const currentVal = getCurrentType(unit).name.toLowerCase();
        unitElements[unit.unitID].querySelector(`.radio__button[value="${currentVal}"]`).checked = true;
        alert("Not enough points to upgrade unit type.")
    }

    console.log("Finished handling Force Type change.")
};

function calcPointCost(unit) {
    console.log(`${players[playerId].name}'s current points are: ${players[playerId].currentPoints}.`)

    let condition = null;
    let checker;

    const tempType = unit.types.filter(type => type.isType);
    const typePoints = tempType.map(type => type.typeCost).reduce((acc, cost) => acc + cost, 0);
    
    const tempAbility = unit.abilities.filter(ability => ability.hasAbility);
    const abilityPoints = tempAbility.map(abil => abil.cost).reduce((acc, cost) => acc + cost, 0);

    unit.currentCost = abilityPoints + typePoints;
    console.log("Current unit cost:", unit.currentCost);
 
    if (unit.pastCost < unit.currentCost) {
        checker = players[playerId].currentPoints -= unit.currentCost - unit.pastCost;
    }
    if (unit.pastCost > unit.currentCost) {
        checker = players[playerId].currentPoints += unit.pastCost - unit.currentCost;
    }

    if (checker < 0) {
        //gtfo
        condition = false;
        //return
    } else if (checker >= 0) {
        //stick around and calculate
        condition = true;

        playerRef.update({
            currentPoints: checker,
        })

        unit.pastCost = unit.currentCost;
        calcStats(unit);
        updateUnitOnServer(unit);

        console.log("Points were deducted. User's current point(s):", players[playerId].currentPoints)
    }
    displayPoints(players[playerId].currentPoints);
    
    return condition; // give a bool to caller
};

function calcStats(unit) {
    const type = unit.types.filter(type => type.isType)[0];
    const matching = unit.abilities.filter(ability => ability.hasAbility);

    if (type.name === "REGULAR") {
        unit.maxAbilities = 1;
        unit.unitDice = 6;
    } else if (type.name === "HEROIC") {
        unit.maxAbilities = 2;
        unit.unitDice = 3;
    } else if (type.name === "ELITE") {
        unit.maxAbilities = 3;
        unit.unitDice = 6;
    } else { console.error("Could not calculate unit type.") }

    if (matching.length > 0) {
        let temp = matching.map(item => item.abilityID);

        // Ensure temp does not contain more than unit.maxAbilities elements
        temp = temp.slice(0, unit.maxAbilities);

        unit.abilities.forEach(ability => {
            if (temp.includes(ability.abilityID)) {
                ability.hasAbility = true;
            } else {
                ability.hasAbility = false;
            }
        });
    }

    console.log(`Unit ${unit.unitID} is of type: ${type.name}.`);
    console.log(`Unit ${unit.unitID}'s max abilitiy count is now ${unit.maxAbilities}.`);
    console.log(`Unit ${unit.unitID}'s current ability list:`, unit.abilities.filter(ability => ability.hasAbility))
};

function checkRadios(id, unit) {
    if (id === `isDead-${unit.unitID}`) {
        unit.isDead = true;
    }
    if (id === `notDead-${unit.unitID}`) {
        unit.isDead = false;
    }
    if (id === `yesTurn-${unit.unitID}`) {
        unit.isTurn = true;
    }
    if (id === `notTurn-${unit.unitID}`) {
        unit.isTurn = false;
    }
    if (id === `hasCover-${unit.unitID}`) {
        unit.isCovered = true;
    }
    if (id === `noCover-${unit.unitID}`) {
        unit.isCovered = false;
    }
    if (id === `slowSpeed-${unit.unitID}`) {
        unit.isSlowed = true;
    }
    if (id === `normalSpeed-${unit.unitID}`) {
        unit.isSlowed = false;
    }
};

function checkInputChange(target, unit) {
    if (target.id === `forceCardNotes-${unit.unitID}`) {
        unit.notes = target.value;
    }
    if (target.id === `forceCardName-${unit.unitID}`) {
        unit.name = target.value;
    }
    if (target.id === `editReserves-${unit.unitID}`) {
        unit.reserveCount = target.value;
    }
    if (target.id === `freeRerolls-${unit.unitID}`) {
        unit.freeRerolls = target.value;
    }
    if (target.id === `range-${unit.unitID}`) {
        unit.attackRange = target.value;
    }
    if (target.id === `unitDice-${unit.unitID}`) {
        unit.unitDice = target.value;
    }
    if (target.id === `maxAbilities-${unit.unitID}`) {
        unit.maxAbilities = target.value;
    }
};

function addAbility(ability, unit) {
    let bool = false;
    if (ability.hasAbility) { return bool; }

    const condition1 = unit.abilities.filter(obj => obj.hasAbility).length < unit.maxAbilities;
    if (!condition1) { 
        alert(`This unit's max ability count is ${unit.maxAbilities}.`);
        return bool; 
    };

    const condition2 = ability.cost <= players[playerId].currentPoints;
    if (!condition2) { 
        alert(`Not enough points to purchase ability. Points remaining: ${players[playerId].currentPoints}`);
        return bool;
    };
    
    if (condition1 && condition2) {
        ability.hasAbility = true;
        bool = true;
    } else { conolse.error("No"); return bool;}
    
    if (!calcPointCost(unit)) {
        ability.hasAbility = false;
        calcPointCost(unit);
        console.log("ability " + ability.name + " is",  ability.hasAbility);
    }

    updateUnitOnServer(unit);
    return bool;
};

function promptRemoveAbility(elm, ability, unit, toggle) { //elm for positioning

    const screenH = window.innerHeight + window.scrollY;
    let position = elm.getBoundingClientRect().bottom + window.scrollY + 5;
    if ((position + 100) > screenH) {
        position = elm.getBoundingClientRect().top + window.scrollY - 101; // I think the dialog is 96px tall
    }

    if (unit.abilities.filter(obj => obj.hasAbility).includes(ability)) {

        document.getElementById('dialog__prompt').style.top = position + "px";

        document.getElementById('dialog__prompt').show();

        // Set dialog message
        document.getElementById('dialog-message').innerText = `Are you sure you want to remove the ability "${ability.name}"?`;

        // Create a promise and resolve it when the user confirms
        return new Promise(resolve => {
            // Define resolveDialog in the global scope
            window.resolveDialog = function(result) {
            // Hide overlay and custom dialog
            document.getElementById('dialog__prompt').close();

            // Resolve the promise with the user's choice
            resolve(result);

            if (result) {
                ability.hasAbility = false;
                calcPointCost(unit);
            } else { 
                toggle.checked = true;
                console.log("Dialog closed without removing ability.") 
            }
            };
            updateUnitOnServer(unit);
        });
    } // else do nothing
};