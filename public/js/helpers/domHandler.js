/************************************************************/
/* A collection of functions that manipulate DOM elements. */
/************************************************************/

function isTouchSupported() {
    return 'ontouchstart' in window;
};

// My attempt at mobile support, listen for double tap
const addDoubleTapListener = (element, callback, input1, input2) => {
    let lastTapTime = 0;
  
    element.addEventListener('touchend', function(event) {
      const currentTime = new Date().getTime();
      const tapDuration = currentTime - lastTapTime;
  
      if (tapDuration < 300) { // Adjust the time threshold as needed
        callback(event, input1, input2, true);
        return true; // Double tap occurred
      }
  
      lastTapTime = currentTime;
      return false; // Single tap
    });
};


function populateAbilityUI(unit) {
    const fullAbilityList = document.getElementById("fullAbilityList");
    const currentAbilityDisplay = document.getElementById("currentAbilityDisplay");
    const defaultText = "Tap ability for desrciption.\nDouble tap an ability to add it.\nPress and hold to remove an ability."
    const el = document.getElementById("showAbilityDescription");

    // Clear existing abilities in the UI
    fullAbilityList.innerHTML = '';
    currentAbilityDisplay.innerHTML = '';

    unit.abilities.forEach(ability => {
        const mainAbility = document.createElement('li');
        mainAbility.textContent = ability.name;

        const pressEvent = new Hammer(mainAbility, {
            recognizers: [
                [Hammer.Press, { time: 1200, threshold: 10 }]
            ]
        });
        
        pressEvent.on("press", event => {
            promptRemoveAbility(event, ability, unit);
        });

        const tapEvent = new Hammer(mainAbility);

        tapEvent.on("tap", event => {
            if (event.tapCount >= 2) {
                addAbility(ability, unit);
            } else {
                showDescription(ability, defaultText, el);
            }
        });

        fullAbilityList.appendChild(mainAbility);
        
        if (ability.hasAbility) {
            const displayedAbility = document.createElement('li');
            displayedAbility.textContent = ability.name;

            const pressEvent = new Hammer(displayedAbility, {
                recognizers: [
                    [Hammer.Press, { time: 1200, threshold: 10 }]
                ]
            });
            
            pressEvent.on("press", event => {
                promptRemoveAbility(event, ability, unit);
            });
    
            const tapEvent = new Hammer(displayedAbility);
    
            tapEvent.on("tap", () => {
                showDescription(ability, defaultText, el);
            });

            currentAbilityDisplay.appendChild(displayedAbility);
            displayedAbility.classList.add('selected');
            mainAbility.classList.add('selected');
        }
    });
};

function populateTypeUI(unit) {
    const defaultText = "Tap to see unit type description.\nDouble tap to change unit type."
    const el = document.getElementById("showTypeDescription");

    // Clear existing abilities in the UI
    currentTypeDisplay.innerHTML = "";

    unit.types.forEach(type => {
        const typeLI = document.createElement('li');
        typeLI.textContent = type.name;

        //typeLI.onclick = (evt) => clickType(evt, type, unit, false);

        const tapEvent = new Hammer(typeLI);

        tapEvent.on("tap", event => {
            if (event.tapCount >= 2) { // Double tap
                if (type.isType) { return }

                changeType(type, unit);
                
                setTimeout(() => { // We need a small delay before updating the dom
                    document.getElementById("unitDice").value = unit.unitDice;
                    document.getElementById("maxAbilities").value = unit.maxAbilities;
                }, 100); 
            } else { // Single tap
                showDescription(type, defaultText, el);
            }
        });

        currentTypeDisplay.appendChild(typeLI);
        
        if (type.isType) {
            typeLI.classList.add('selected');
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

// Dynamically resize textarea columns -- NOT NEEDED
function setColumns(textarea) {
    const containerWidth = textarea?.parentNode?.offsetWidth || 0;
    const columnsMultiplier = 0.09;

    console.log("resize of text area part 3")
    textarea.cols = Math.floor(containerWidth * columnsMultiplier);
};