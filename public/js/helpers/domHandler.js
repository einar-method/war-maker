/************************************************************/
/* A collection of functions that manipulate DOM elements. */
/************************************************************/

function populateAbilityUI(unit) {
    const fullAbilityList = document.getElementById("fullAbilityList");
    const currentAbilityDisplay = document.getElementById("currentAbilityDisplay");

    // Clear existing abilities in the UI
    fullAbilityList.innerHTML = '';
    currentAbilityDisplay.innerHTML = '';

    unit.abilities.forEach(ability => {
        const mainAbility = document.createElement('li');
        mainAbility.textContent = ability.name;

        mainAbility.onclick = (evt) => clickAbility(evt, ability, unit);
        mainAbility.addEventListener('contextmenu', event => promptRemoveAbility(event, ability, unit));
        //mainAbility.addEventListener('mouseover', event => showDescription(event, ability));

        fullAbilityList.appendChild(mainAbility);
        
        if (ability.hasAbility) {
            const displayedAbility = document.createElement('li');
            displayedAbility.textContent = ability.name;
            displayedAbility.onclick = (evt) => clickAbility(evt, ability, unit);
            displayedAbility.addEventListener('contextmenu', event => promptRemoveAbility(event, ability, unit));
            currentAbilityDisplay.appendChild(displayedAbility);
            displayedAbility.classList.add('selected');
            mainAbility.classList.add('selected');
        }
    });
};

function populateTypeUI(unit) {
    //const fullTypeList = document.getElementById("currentTypeDisplay");
    // const diceCount = document.getElementById("unit-dice");

    // Clear existing abilities in the UI
    currentTypeDisplay.innerHTML = "";
    // diceCount.innerHTML = "";
    // diceCount.innerHTML = unit.unitDice;

    unit.types.forEach(type => {
        const typeLI = document.createElement('li');
        typeLI.textContent = type.name;

        typeLI.onclick = () => clickType(type, unit);
        //typeLI.addEventListener('contextmenu', event => promptRemoveAbility(event, ability));
        //typeLI.addEventListener('mouseover', event => showDescription(event, ability));

        currentTypeDisplay.appendChild(typeLI);
        
        if (type.isType) {
            typeLI.classList.add('selected');
            const defaultText = "Left click to see unit type description.\nShift + Left click to change unit type."
            const el = document.getElementById("showTypeDescription");
            showDescription(type, defaultText, el)
        };
    });
};

function createAddCard() {
    const lastCard = document.createElement('section');
    lastCard.className = 'card addTo';

    // Content for the "Add Card" section
    lastCard.innerHTML = `
        <div class="add-card-content">
            <ion-icon name="add-circle"></ion-icon>
            <p>add unit</p>
        </div>
    `;

    // Add an event listener for the "Add Card" section
    lastCard.addEventListener('click', function() {
        addUnit();
    });

    return lastCard;
};

function populateEditForm(unit, target) {
    if (unit.isIntializing === true) {
        console.log("First time unit here");
        changeType(unit.getCurrentType(), unit);
        unit.name = unit.getCurrentType().name;
    }

    document.getElementById("unit-image-display").src = unit.imageSrc;

    document.getElementById("uploadImage").addEventListener('change', function () {
        const fileName = this.files[0] ? this.files[0].name : 'Choose File';
        document.getElementById("fileLabel").textContent = fileName;
        
        handleImageUpload(document.getElementById("uploadImage"), unit, target);
        
        setTimeout(() => {
            document.getElementById("unit-image-display").src = unit.imageSrc;
        }, 10);
        // Without the timer, the image does not update
    });

    document.getElementById("save-edit").addEventListener("click", function() {
        saveEdit(unit, target);
    });

    document.getElementById("removeImage").addEventListener("click", function() {
        removeImage(unit, target);
    });

    document.getElementById("fileLabel").innerHTML = "";
    document.getElementById("uploadImage").value = "";


    document.getElementById("range").value = unit.attackRange;

    document.getElementById("unitDice").value = unit.unitDice;

    unit.isDead
        ? document.getElementById("isDead").checked = true
        : document.getElementById("notDead").checked = true;
    // set condition radio
    unit.isTurn
        ? document.getElementById("yesTurn").checked = true 
        : document.getElementById("notTurn").checked = true;
    // set turn radio
    unit.isCovered
        ? document.getElementById("hasCover").checked = true
        : document.getElementById("noCover").checked = true;
    // set cover radio
    unit.isSlowed
        ? document.getElementById("slowSpeed").checked = true
        : document.getElementById("normalSpeed").checked = true;
    // set movement radio

    document.getElementById("editReserves").value = unit.reserveCount;

    document.getElementById("maxAbilities").value = unit.maxAbilities;
    
    document.getElementById("freeRerolls").value = unit.freeRerolls;

    document.getElementById("editTitle").value = unit.name;

    populateAbilityUI(unit);
    populateTypeUI(unit);
};

function deleteCreatedElements() {
    // Get references to the top-level containers
    const editOverlay = document.getElementById('editOverlay');
    
    // Check if the elements exist before attempting to delete them
    if (editOverlay) {
        // Remove the editOverlay element and its children
        editOverlay.parentNode.removeChild(editOverlay);
    }
};