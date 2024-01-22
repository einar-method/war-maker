// Simple add unit function. WIP: need to handle errors 
function addUnitForDatabase (unit) {
    return database.ref('units/' + unit.unitID).set(unit);
};

const unitsList = []; // ONLY for testing
function beginForceCreation() {

    //console.log("Attempting to create a unit");
    //console.log("Available Points:", players[playerId].currentPoints);

if (players[playerId].currentPoints >= 3) { // Previously p1.currentPoints 
    const unit = new Force();
    //console.log("Created unit with ID:", unit.unitID);
    //const card = unit.createForceCard();
    //cardContainer.insertBefore(card, cardContainer.lastElementChild); 
    //unitsList.push(unit)

    // calcPointCost(unit)
    // Firebase
    unit.owner = playerId; // Assign the user ID
    addUnitForDatabase(unit)
        .then(() => {
            //console.log('Force added successfully');

            // Set up onDisconnect for the new unit
            const unitRef = firebase.database().ref(`units/${unit.unitID}`);
            unitRef.onDisconnect().remove(); // Remove unit when the user disconnects
        
        })
        .catch(error => {
            console.error('Error adding force:', error);
        });

    // const newType = unit.types.find(type => type.name === "REGULAR");
    // changeType(newType, unit);
    
    //calcPointCost(unit);
    //changeType(unit)

    //const currentVal = unit.getCurrentType().name.toLowerCase();
    // document.getElementById("forceRadioSet-"+unit.unitID).querySelector(`.radio__button[value="${currentVal}"]`).checked = true;
    //console.log(currentVal)

    //console.log("unit before listen:", unit)
    
    //updateUnitOnServer(unit)

    // document.getElementById("forceRadioSet-"+unit.unitID).addEventListener('change', function(event) {
    //     const selectedValue = event.target.value;
    //     //console.log(selectedValue)
    //     //console.log(event)
    //     //console.error(unit)

    //     if (selectedValue === 'regular') {
    //       // Do something for REGULAR option
    //       unit.types[0].isType = true;
    //       console.log('Regular option selected');
    //     } else if (selectedValue === 'heroic') {
    //       // Do something for HEROIC option
    //       unit.types[1].isType = true;
    //       console.log('Heroic option selected');
    //     } else if (selectedValue === 'elite') {
    //       // Do something for ELITE option
    //       unit.types[2].isType = true;
    //       console.log('Elite option selected');
    //     }

    //     if (unit.getCurrentType().name == selectedValue.toUpperCase()) { console.log("works"); return; }

    //     //document.getElementById("forceRadioSet-"+unit.unitID).querySelector(`.radio__button[value="${selectedValue}"]`).checked = true;
    //     const newType = unit.types.find(type => type.name == selectedValue.toUpperCase());

    //     //console.log("type test:", unit.types.find(type => type.name == selectedValue))
        
    //     console.error(unit)

    //     changeType(newType, unit);
    //     // Update unit on server
    //     //updateUnitOnServer(unit);
        
    //     setTimeout(() => {
    //         document.getElementById("unitDice-"+unit.unitID).value = unit.unitDice;
    //         document.getElementById("maxAbilities-"+unit.unitID).value = unit.maxAbilities;
    //     }, 100); 
    // });

            
    
            // if (unit.isIntializing === true) {
            //     //console.log("First time unit here");
            //     changeType(unit.getCurrentType(), unit);
            //     unit.name = unit.getCurrentType().name;
            // }

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
    
        } else { 
            alert("Not enough points to create a unit. Points remaining: " + players[playerId].currentPoints)
            console.log("Unit creation failed");
            console.log("Points remaining:", players[playerId].currentPoints);
        } 
}

function addUnit() {
    console.log("Attempting to create a unit");
    console.log("Available Points:", players[playerId].currentPoints);

    if (players[playerId].currentPoints >= 3) { // Previously p1.currentPoints 
        //p1.currentPoints -= 3;

        const unit = new Force();
        console.log("Created unit with ID:", unit.unitID);

        //update below with battleForces array
        // p1.allUnits.push(unit);
        // unit.owner = p1
        // console.log(unit.owner);
        // console.log(p1.allUnits);

        // Get random image before making card
        unit.rndDefaultImg();

        // Make a crad for the unit
        const card = unit.createCard();

        // Insert before the last child (Add Unit)
        cardContainer.insertBefore(card, cardContainer.lastElementChild); 
        
        // Firebase
        unit.owner = playerId; // Assign the user ID
        addUnitForDatabase(unit)
            .then(() => {
                console.log('Force added successfully');

                // Set up onDisconnect for the new unit
                const unitRef = firebase.database().ref(`units/${unit.unitID}`);
                unitRef.onDisconnect().remove(); // Remove unit when the user disconnects
            
            })
            .catch(error => {
                console.error('Error adding force:', error);
            });

        showEditForm(unit, card)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    } else { 
        alert("Not enough points to create a unit. Points remaining: " + players[playerId].currentPoints)
        console.log("Unit creation failed");
        console.log("Points remaining:", players[playerId].currentPoints);
    } 
};

// Remove a given unit
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
    })
    .then(() => {
        console.log(`Unit ${unit.unitID} updated on the server successfully`);
    })
    .catch(error => {
        console.error(`Error updating unit ${unit.unitID} on the server:`, error);
    });
};

// function updateForceValueOnServer(unit, val) {
//     const unitRef = firebase.database().ref(`units/${unit.unitID}`);

//     // Update the server-side data
//     unitRef.update(val)
//     .then(() => {
//         console.log(`Unit ${unit.unitID} updated on the server successfully`);
//     })
//     .catch(error => {
//         console.error(`Error updating unit ${unit.unitID} on the server:`, error);
//     });
// };

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
    console.log(temp)
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

    // setTimeout(() => {
    //     document.getElementById("unitDice-"+unit.unitID).value = units[unit.unitID].unitDice;
    //     document.getElementById("maxAbilities-"+unit.unitID).value = units[unit.unitID].maxAbilities;
    // }, 100); 
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
        console.log("math1:", unit.currentCost - unit.pastCost)
    }
    if (unit.pastCost > unit.currentCost) {
        checker = players[playerId].currentPoints += unit.pastCost - unit.currentCost;
        console.log("math2:", unit.currentCost - unit.pastCost)
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
        //console.log(`Unit ${unit.unitID} is of type: ${type.name}`)
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

    //calcPointCost(units[unit.unitID]);
    //populateAbilityUI(this);
    //updateCard(this);

    console.log(`Unit ${unit.unitID} is of type: ${type.name}.`);
    console.log(`Unit ${unit.unitID}'s max abilitiy count is now ${unit.maxAbilities}.`);
    console.log(`Unit ${unit.unitID}'s current ability list:`, unit.abilities.filter(ability => ability.hasAbility))
};

function buildAbilitySheet(unit) {
    const self = unit;
    const overlay = document.createElement("div");
    overlay.classList.add("edit-overlay");
    overlay.id = "abilitySheet-"+unit.unitID;

    const container = document.createElement("div");
    container.classList.add("edit-container");

    // Header elements
    const header = document.createElement("div");
    header.classList.add("ability__sheet__header-footer");

    header.innerHTML = `
        <div class="orange"></div>
        <h1><span class="title__text-green">ABILITY</span> <span class="title__text-camo">SHEET</span></h1> 
        <div class="orange"></div>  
    `;

    // Footer elements
    const footer = document.createElement("div");
    footer.classList.add("ability__sheet__header-footer");
    footer.innerHTML = `
        <div class="orange"></div>
        <button type="button" onclick="toggleAbilitySheet(this, false, 'edit-overlay')"><h1><span class="title__text-green">Save</span> & <span class="title__text-camo">Close</span></h1></button>
        <div class="orange"></div>
    `;

    const main = document.createElement("div");
    const list = document.createElement("ul");
    list.classList.add("ability__sheet__list");

    //const currentAbilityDisplay = document.getElementById("currentAbilityDisplay");
    //const defaultText = "Tap ability for desrciption.\nDouble tap an ability to add it.\nPress and hold to remove an ability."
    //const el = document.getElementById("showAbilityDescription");

    // Clear existing abilities in the UI
    //list.innerHTML = '';
    //currentAbilityDisplay.innerHTML = '';
    document.body.appendChild(overlay);
    overlay.appendChild(container);
    container.appendChild(header);
    container.appendChild(main);
    main.appendChild(list);
    container.appendChild(footer);

    unit.abilities.forEach(ability => {
        const inner = document.createElement("div");
        inner.innerHTML = `
        <label class="switch">
            <input type="checkbox" id="abilityToggle${ability.abilityID}" autocomplete="off">
            <span class="slider"></span>
        </label>
        <li>${ability.name}: ${ability.description}</li>
        `;

        list.appendChild(inner);
        
        const toggle = document.getElementById("abilityToggle"+ability.abilityID);

        if (ability.hasAbility) {
            // toggle slider
            toggle.checked = true;
        } else { toggle.checked = false }

        toggle.addEventListener('change', function() {
            const isChecked = toggle.checked;
            console.log(`Ability ${ability.name} is now ${isChecked ? 'checked' : 'unchecked'}`);
            if (isChecked == true) {
                addAbility(ability, self);
                return;
            }
            if (isChecked == false) {
                promptRemoveAbility(inner, ability, self, toggle);
            }
        });
    });
};