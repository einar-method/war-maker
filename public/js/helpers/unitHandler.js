// Simple add unit function. WIP: need to handle errors 
function addUnitForDatabase (unit) {
    return database.ref('units/' + unit.unitID).set(unit);
};

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
        imageSrc: unit.imageSrc,
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
        // Add other properties as needed
    })
    .then(() => {
        console.log(`Unit ${unit.unitID} updated on the server successfully`);
    })
    .catch(error => {
        console.error(`Error updating unit ${unit.unitID} on the server:`, error);
    });
};