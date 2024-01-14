/************************************************************/
/* A collection of functions to handle the unit edit form. */
/************************************************************/

function showEditForm(event, unit, input) {
    
    document.body.style.overflow = "hidden";

    let target = null;

    // Use cloning to remove listeners on all other unit cards
    let editBtn = document.getElementById("save-edit");
    // const newSave = editBtn.cloneNode(true);
    // editBtn.parentNode.replaceChild(newSave, editBtn);

    const originalForm = document.getElementById("editForm");

    const container = document.getElementById("edit-container");

    // Clone the form and its children
    const clonedForm = originalForm.cloneNode(true);

    // Replace the original form with the cloned form
    container.replaceChild(clonedForm, originalForm);

    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", function(event) {
          // Prevent the default form submission behavior
          event.preventDefault();
        });
    });


    if (event) {
        event.preventDefault();
        target = event.currentTarget;
    } else if (input) {
        target = input;
    } else {console.log("Problem with showing Edit Form")}

    document.getElementById('editOverlay').style.display = 'flex';


    editBtn.addEventListener("click", function() {
        saveEdit(unit, target);
    });

    populateEditForm(unit, target);

    document.getElementById("edit-container").style.overflow = "auto";
    const editContainer = document.querySelector('.edit-container');

    //console.log("Before scroll:", editContainer.scrollTop);
    editContainer.scrollTop = 0;
    //console.log("After scroll:", editContainer.scrollTop);

    document.querySelector('.edit-overlay').style.display = 'flex';
    editContainer.style.display = 'block';
    
};

function saveEdit(unit, target) {
    // Update the dom content with new object values
    const newTitle = document.getElementById('editTitle').value;
 
    // Check if the values have changed before updating the object
    if (newTitle !== unit.name) {
        unit.name = newTitle;
        target.querySelector('.card-title').innerHTML = unit.name;
    };
    if (newTitle === "" || newTitle === null || newTitle === "TROOP" || newTitle === "HERO" || newTitle === "ELITE") {
        unit.name = unit.getCurrentType().name;
        target.querySelector('.card-title').innerHTML = unit.name;
    };

    target.querySelector('.card-title').innerHTML = unit.name;

    target.querySelector('#unit-type').innerHTML = unit.getCurrentType().name;

    //handleImageUpload(document.getElementById("uploadImage"), unit, target);

    const newReserves = document.getElementById('editReserves').value;
    if (newReserves !== unit.reserveCount) {
        unit.reserveCount = newReserves;
        target.querySelector('#unit-reserves').innerHTML = unit.reserveCount;
    };

    // Filter abilities with hasAbility set to true
    const matchingBool = unit.abilities.filter(ability => ability.hasAbility);

    // Take the first three matching abilities
    const temp = matchingBool.slice(0, 3);

    // Update the DOM content with the ability names
    target.querySelector('#unit-abil1').innerText = temp[0] ? temp[0].name : '';
    target.querySelector('#unit-abil2').innerText = temp[1] ? temp[1].name : '';
    target.querySelector('#unit-abil3').innerText = temp[2] ? temp[2].name : '';

    // This bool should only be true when a unit is first made
    unit.isIntializing = false;

    // Update the unit dice and display it
    // unit.unitDice = document.getElementById("unitDice").value; // updated elsewhere atm
    const unitDiceElement = document.querySelector(`#card-${unit.unitID} div p #unit-dice`);

    if (unitDiceElement) {
        unitDiceElement.innerHTML = unit.unitDice;
    } else {
        console.error("Unit card not found when trying to update unit dice count!");
    }
    
    // Update the unit range and display it
    unit.attackRange = document.getElementById("range").value;
    const unitRangeElm = document.querySelector(`#card-${unit.unitID} div p #unit-rng`);

    if (unitRangeElm) {
        unitRangeElm.innerHTML = unit.attackRange;
    } else {
        console.error("Unit card not found when trying to update unit range!");
    }
    
    // Update the unit reserve count and display it
    unit.reserveCount = document.getElementById("editReserves").value;
    const unitReserveElm = document.querySelector(`#card-${unit.unitID} div p #unit-reserves`);

    if (unitReserveElm) {
        unitReserveElm.innerHTML = unit.reserveCount;
    } else {
        console.error("Unit card not found when trying to update unit reserves!");
    }
    
    // Update the unit free rerolls and display it
    unit.freeRerolls = document.getElementById("freeRerolls").value;
    //const unitRerollElm = document.querySelector(`#card-${unit.unitID} div p #unit-reserves`);

    // if (unitRerollElm) { // Currently not shown other than on form
    //     unitRerollElm.innerHTML = unit.freeRerolls;
    // } else {
    //     console.error("Unit card not found when trying to update unit rerolls!");
    // }

    // Update all the side bar icons based on current stats
    unit.isDead = document.querySelector('input[name="healthStatus"][value="dead"]').checked;
    console.log(`Unit ${unit.unitID} is dead?`, unit.isDead);
    
    unit.isTurn = document.querySelector('input[name="turnStatus"][value="active"]').checked;
    console.log(`Unit ${unit.unitID} is currently active?`, unit.isTurn);
    
    unit.isCovered = document.querySelector('input[name="coverStatus"][value="cover"]').checked;
    console.log(`Unit ${unit.unitID} has cover?`, unit.isCovered);
    
    unit.isSlowed = document.querySelector('input[name="speedStatus"][value="yesSlow"]').checked;
    console.log(`Unit ${unit.unitID} is slowed?`, unit.isSlowed);

    target.querySelector(".side-bar").innerHTML = `
            <p id="unit-death">${unit.isDead ? '☠️' : '💚'}</p>
            <p id="unit-cover">${unit.isCovered ? '🛡️' : '👁️‍🗨️'}</p>
            <p id="unit-speed">${unit.isSlowed ? '🐌' : '💨'}</p>
            <p id="unit-turn">${unit.isTurn ? '💢' : '💤'}</p>
        `;
    // Above code block updates the card's sidebar

    const newAbilityMax = document.getElementById("maxAbilities").value;
    if (newAbilityMax !== unit.maxAbilities) {
        unit.maxAbilities = newAbilityMax;
    };

    // Update unit on server
    updateUnitOnServer(unit);

    // Hide the edit overlay and let body scroll
    document.getElementById("editOverlay").style.display = "none";
    document.body.style.overflow = "auto";

    // Reset any opened form boxes
    document.querySelectorAll(".expandable").forEach(expandable => {
        expandable.classList.toggle("expandable--open", false);
    });
    
    document.querySelectorAll(".expandable__icon").forEach(icon => {
        icon.style.opacity = 0;
        icon.setAttribute("name", "chevron-collapse");
        icon.style.opacity = 1;
    });

    
    // playerRef.update({
    //     units: players[playerId].allUnits,
    // })
    //deleteCreatedElements(); // Only need when generating the form
    
};

function removeImage(unit, target) {
    unit.rndDefaultImg();
    document.getElementById("unit-image-display").src = unit.imageSrc;

    const imageElement = target.querySelector('.card-img');

    if (imageElement) {
        const parentSection = imageElement.closest('section');

        if (parentSection && parentSection.id === "card-" + unit.unitID) {
                // if (imageElement && imageElement instanceof HTMLImageElement) {

            imageElement.src = unit.imageSrc;
        }
    }
};

// document.body.addEventListener("click", (evt) => {
    //closeBoxes(evt)
    // const isExand = !!evt.target.closest(".expandable__title-bar");
    // const expand = evt.target.closest(".expandable");


function clickAbility(event, ability, unit) {
    let bool = false;

    const userInput = event.button;
    const isListItem = event.target.tagName === 'LI';

    // Left click = show ability description
    if (isListItem && userInput === 0 && !event.shiftKey) {
        const defaultText = "Left click an ability for desrciption.\nShift + Left click to add an ability.\nRight click to remove an ability."
        const el = document.getElementById("showAbilityDescription");
        showDescription(ability, defaultText, el);
        //return true;
    }
    // Shift + Left click = edit abilities
    if (isListItem && userInput === 0 && event.shiftKey) {
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
            populateAbilityUI(unit);
        } else { conolse.error("No"); return bool;}
        
        if (!unit.calculatePoints()) {
            ability.hasAbility = false;
            unit.calculatePoints();
            console.log("ability " + ability.name + " is",  ability.hasAbility);
            populateAbilityUI(unit);
        }
    }
};

function changeType(type, unit) {
    const state = unit.types.map(obj => ({ ...obj }));

    unit.types.forEach(function(element) {
        if (element != type) {
            element.isType = false;
            console.log("Changed " + element.name + " to:", element.isType);
        } else { 
            type.isType = true;
            console.log("Changed " + element.name + " to:", element.isType);
        }
    });

    if (unit.calculatePoints()) {
        //console.log("There were enough points for calculation")
    } else if (!unit.calculatePoints()) {
        unit.types.forEach(function(element, index) {
            element.isType = state[index].isType;
            console.log("Reverted " + element.name + " to:", state[index].isType);
        });
        unit.calculatePoints();
        alert("Not enough points to upgrade unit type.")
    }
    
    unit.calcStats();
    populateTypeUI(unit);
};

function clickType(type, unit) {
    const userInput = event.button;
    const isListItem = event.target.tagName === 'LI';

    // Left click - show
    if (isListItem && userInput === 0 && !event.shiftKey) {
        const defaultText = "Left click to see unit type description.\nShift + Left click to change unit type."
        const el = document.getElementById("showTypeDescription");
        showDescription(type, defaultText, el)
    }

    // Shift Left - change
    if (isListItem && userInput === 0 && event.shiftKey) {
        if (type.isType) { return }

        changeType(type, unit);
        
        setTimeout(() => {
            document.getElementById("unitDice").value = unit.unitDice;
            document.getElementById("maxAbilities").value = unit.maxAbilities;
        }, 100); 
    }
};

function showDescription(input, text, el) {
    el.innerText = input.name + ": " + input.description;

    // Clear the existing timeout
    clearTimeout(showDescription.timeout);

    // Show default text after 10 seconds
    showDescription.timeout = setTimeout(() => {
        el.innerText = text;
    }, 10000);
    
};

function promptRemoveAbility(event, ability, unit) {
    event.preventDefault(); // Prevent the default context menu from appearing

    if (unit.abilities.filter(obj => obj.hasAbility).includes(ability)) {
        
        document.getElementById('dialog__prompt').style.top = event.clientY - document.getElementById('dialog__prompt').clientHeight - 100 + "px";
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
                unit.calculatePoints();
                populateAbilityUI(unit);
            } else { console.log("Dialog closed without removing ability.") }
            };
        });
    } // else do nothing
};