/************************************************************/
/* A collection of functions that manipulate DOM elements. */
/************************************************************/

function isTouchSupported() {
    return 'ontouchstart' in window;
};

// My attempt at mobile support, listen for double tap
// const addDoubleTapListener = (element, callback, input1, input2) => {
//     let lastTapTime = 0;
  
//     element.addEventListener('touchend', function(event) {
//       const currentTime = new Date().getTime();
//       const tapDuration = currentTime - lastTapTime;
  
//       if (tapDuration < 300) { // Adjust the time threshold as needed
//         callback(event, input1, input2, true);
//         return true; // Double tap occurred
//       }
  
//       lastTapTime = currentTime;
//       return false; // Single tap
//     });
// };


// function populateAbilityUI(unit) {
//     const fullAbilityList = document.getElementById("fullAbilityList");
//     const currentAbilityDisplay = document.getElementById("currentAbilityDisplay");
//     const defaultText = "Tap ability for desrciption.\nDouble tap an ability to add it.\nPress and hold to remove an ability."
//     const el = document.getElementById("showAbilityDescription");

//     // Clear existing abilities in the UI
//     fullAbilityList.innerHTML = '';
//     currentAbilityDisplay.innerHTML = '';

//     unit.abilities.forEach(ability => {
//         const mainAbility = document.createElement('li');
//         mainAbility.textContent = ability.name;

//         const pressEvent = new Hammer(mainAbility, {
//             recognizers: [
//                 [Hammer.Press, { time: 1200, threshold: 10 }]
//             ]
//         });
        
//         pressEvent.on("press", event => {
//             promptRemoveAbility(event, ability, unit);
//         });

//         const tapEvent = new Hammer(mainAbility);

//         tapEvent.on("tap", event => {
//             if (event.tapCount >= 2) {
//                 addAbility(ability, unit);
//             } else {
//                 showDescription(ability, defaultText, el);
//             }
//         });

//         fullAbilityList.appendChild(mainAbility);
        
//         if (ability.hasAbility) {
//             const displayedAbility = document.createElement('li');
//             displayedAbility.textContent = ability.name;

//             const pressEvent = new Hammer(displayedAbility, {
//                 recognizers: [
//                     [Hammer.Press, { time: 1200, threshold: 10 }]
//                 ]
//             });
            
//             pressEvent.on("press", event => {
//                 promptRemoveAbility(event, ability, unit);
//             });
    
//             const tapEvent = new Hammer(displayedAbility);
    
//             tapEvent.on("tap", () => {
//                 showDescription(ability, defaultText, el);
//             });

//             currentAbilityDisplay.appendChild(displayedAbility);
//             displayedAbility.classList.add('selected');
//             mainAbility.classList.add('selected');
//         }
//     });
// };

// function populateTypeUI(unit) {
//     const defaultText = "Tap to see unit type description.\nDouble tap to change unit type."
//     const el = document.getElementById("showTypeDescription");

//     // Clear existing abilities in the UI
//     currentTypeDisplay.innerHTML = "";

//     unit.types.forEach(type => {
//         const typeLI = document.createElement('li');
//         typeLI.textContent = type.name;

//         //typeLI.onclick = (evt) => clickType(evt, type, unit, false);

//         const tapEvent = new Hammer(typeLI);

//         tapEvent.on("tap", event => {
//             if (event.tapCount >= 2) { // Double tap
//                 if (type.isType) { return }

//                 changeType(type, unit);
                
//                 setTimeout(() => { // We need a small delay before updating the dom
//                     document.getElementById("unitDice").value = unit.unitDice;
//                     document.getElementById("maxAbilities").value = unit.maxAbilities;
//                 }, 100); 
//             } else { // Single tap
//                 showDescription(type, defaultText, el);
//             }
//         });

//         currentTypeDisplay.appendChild(typeLI);
        
//         if (type.isType) {
//             typeLI.classList.add('selected');
//             showDescription(type, defaultText, el)
//         };
//     });
// };

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
        beginForceCreation();
        //was addUnit()
    });

    return lastCard;
};

// function populateEditForm(unit, target) {
//     if (unit.isIntializing === true) {
//         console.log("First time unit here");
//         changeType(unit.getCurrentType(), unit);
//         unit.name = unit.getCurrentType().name;
//     }

//     document.getElementById("unit-image-display").src = unit.imageSrc;

//     document.getElementById("uploadImage").addEventListener('change', function () {
//         const fileName = this.files[0] ? this.files[0].name : 'Choose File';
//         document.getElementById("fileLabel").textContent = fileName;
        
//         handleImageUpload(document.getElementById("uploadImage"), unit, target);
        
//         setTimeout(() => {
//             document.getElementById("unit-image-display").src = unit.imageSrc;
//         }, 10);
//         // Without the timer, the image does not update
//     });

//     document.getElementById("save-edit").addEventListener("click", function() {
//         saveEdit(unit, target);
//     });

//     document.getElementById("removeImage").addEventListener("click", function() {
//         removeImage(unit, target);
//     });

//     document.getElementById("fileLabel").innerHTML = "";
//     document.getElementById("uploadImage").value = "";


//     document.getElementById("range").value = unit.attackRange;

//     document.getElementById("unitDice").value = unit.unitDice;

//     unit.isDead
//         ? document.getElementById("isDead").checked = true
//         : document.getElementById("notDead").checked = true;
//     // set condition radio
//     unit.isTurn
//         ? document.getElementById("yesTurn").checked = true 
//         : document.getElementById("notTurn").checked = true;
//     // set turn radio
//     unit.isCovered
//         ? document.getElementById("hasCover").checked = true
//         : document.getElementById("noCover").checked = true;
//     // set cover radio
//     unit.isSlowed
//         ? document.getElementById("slowSpeed").checked = true
//         : document.getElementById("normalSpeed").checked = true;
//     // set movement radio

//     document.getElementById("editReserves").value = unit.reserveCount;

//     document.getElementById("maxAbilities").value = unit.maxAbilities;
    
//     document.getElementById("freeRerolls").value = unit.freeRerolls;

//     document.getElementById("editTitle").value = unit.name;

//     populateAbilityUI(unit);
//     populateTypeUI(unit);
// };

function deleteCreatedElements() {
    // Get references to the top-level containers
    const editOverlay = document.getElementById('editOverlay');
    
    // Check if the elements exist before attempting to delete them
    if (editOverlay) {
        // Remove the editOverlay element and its children
        editOverlay.parentNode.removeChild(editOverlay);
    }
};

// // Dynamically resize textarea columns -- NOT NEEDED
// function setColumns(textarea) {
//     const containerWidth = textarea?.parentNode?.offsetWidth || 0;
//     const columnsMultiplier = 0.09;

//     console.log("resize of text area part 3")
//     textarea.cols = Math.floor(containerWidth * columnsMultiplier);
// };

function toggleAbilitySheet(elm, checker, parentClass) {
    console.log(elm)
    const fullId = findParentByClass(elm, parentClass).id;
    console.log(fullId)
    
    //const parentId = fullId.slice("card-".length);
    const parentId = fullId[0] === "a" ? fullId.slice("abilitySheet-".length) : fullId.slice("card-".length);
    console.log(parentId)
    console.log(units[parentId])

    if(checker == true) {
        document.body.style.overflow = "hidden";

        buildAbilitySheet(units[parentId]);

        document.getElementById("abilitySheet-"+parentId).style.display = 'flex';

        const editContainer = document.querySelector('.edit-container');
        editContainer.style.overflow = "auto";
        //console.log("Before scroll:", editContainer.scrollTop);
        editContainer.scrollTop = 0;
        //console.log("After scroll:", editContainer.scrollTop);

        document.querySelector('.edit-overlay').style.display = 'flex';
        editContainer.style.display = 'block';

    } else if (checker == false) {
        document.body.style.overflow = "unset"; // Is this needed?
        document.querySelector('.edit-overlay')?.remove();
    } else { console.error("Issue retrieving ability sheet") }
};


function createForceCard(unit) {
    //const self = this;
    const section = document.createElement('section');
    section.classList.add('force__card');
    section.id = `card-${unit.unitID}`;

    section.innerHTML = `
    <div class="force__card__labeled-textareas">
        <p class="war-sheet__paragrapgh">FORCE NAME: </p>
        <textarea id="forceCardName" name="forceCardName" rows="1" class="textarea__dynamic" title="Change Force Name" placeholder="Name your force, or leave blank."></textarea>
    </div>
    <div class="force__card__inner">
        <div class="force__card__radio-fieldset force__type-set" id="forceRadioSet-${unit.unitID}">
            <div>
                <input type="radio" id="isRegularForce-${unit.unitID}" class="radio__button" name="forceTypeRadio-${unit.unitID}" value="regular">
                <label for="isRegularForce-${unit.unitID}">REGULAR</label><br>
            </div>
            <div>
                <input type="radio" id="isHeroicForce-${unit.unitID}" class="radio__button" name="forceTypeRadio-${unit.unitID}" value="heroic">
                <label for="isHeroicForce-${unit.unitID}">HEROIC</label>
            </div>
            <div>
                <input type="radio" id="isEliteForce-${unit.unitID}" class="radio__button" name="forceTypeRadio-${unit.unitID}" value="elite">
                <label for="isEliteForce-${unit.unitID}" class="force__card__label">ELITE</label>
            </div>
        </div>
        <div class="force__card__abilities">
            <div class="force__card__labeled-textareas" onclick="toggleAbilitySheet(this, true, 'force__card')">
                <p class="war-sheet__paragrapgh">ABILITY 1: </p>
                <p class="force__card__ability-display"><span id="abil1Display">Click to open Ability Sheet.</span></p>
            </div>
            <div class="force__card__labeled-textareas">
                <p class="war-sheet__paragrapgh">ABILITY 2: </p>
                <p class="force__card__ability-display" onclick="toggleAbilitySheet(this, true, 'force__card')"><span id="abil2Display">Click to open Ability Sheet.</span></p>
            </div>
            <div class="force__card__labeled-textareas">
                <p class="war-sheet__paragrapgh">ABILITY 3: </p>
                <p class="force__card__ability-display"><span id="abil3Display" onclick="toggleAbilitySheet(this, true, 'force__card')">Click to open Ability Sheet.</span></p>
            </div>
        </div>
    </div>
    <div>
        <p class="war-sheet__paragrapgh">NOTES: </p>
        <textarea id="forceCardNotes" name="forceCardNotes" rows="3" class="textarea__dynamic" title="Extra Force Notes" placeholder="Additional notes for this force."></textarea>
    </div>
    <fieldset class="force__card__stats__container">
        <legend class="force__card__title-bar">STATS:</legend>
            <fieldset>
                <legend>Attack Zone</legend>
                <label for="range">0 Melee | 1-5 Ranged</label>
                <input type="number" id="range" class="form__input" name="range" min="0" max="5" step="1" value="0">
            </fieldset>
            <fieldset>
                <legend>Unit Dice</legend>
                <label for="unitDice-${unit.unitID}">Or # of members</label>
                <input type="number" id="unitDice-${unit.unitID}" class="form__input" name="unitDice-${unit.unitID}" min="0" max="6" step="1" value="6">
            </fieldset>
            <fieldset class="force__card__radio-fieldset">
                <legend>Condition</legend>
                <div>
                    <input type="radio" id="notDead" class="radio__button" name="healthStatus" value="alive">
                    <label for="notDead">Alive</label><br>
                </div>
                <div>
                    <input type="radio" id="isDead" class="radio__button" name="healthStatus" value="dead">
                    <label for="isDead">Dead</label>
                </div>
            </fieldset>
            <fieldset class="force__card__radio-fieldset">
                <legend>Activation</legend>
                <div >
                    <input type="radio" id="notTurn" class="radio__button" name="turnStatus" value="inactive">
                    <label for="notTurn">Inactive</label><br>
                </div>
                <div >
                    <input type="radio" id="yesTurn" class="radio__button" name="turnStatus" value="active">
                    <label for="yesTurn">Active</label>
                </div>
            </fieldset>
            <fieldset class="force__card__radio-fieldset">
                <legend>Cover</legend>
                <div>
                    <input type="radio" id="hasCover" class="radio__button" name="coverStatus" value="cover">
                    <label for="hasCover">Has Cover</label><br>
                </div>
                <div>
                    <input type="radio" id="noCover" class="radio__button" name="coverStatus" value="noCover">
                    <label for="noCover">No Cover</label>
                </div>
            </fieldset>
            <fieldset class="force__card__radio-fieldset">
                <legend>Movement</legend>
                <div>
                    <input type="radio" id="normalSpeed" class="radio__button" name="speedStatus" value="noSlow">
                    <label for="normalSpeed">Normal</label><br>
                </div>
                <div>
                    <input type="radio" id="slowSpeed" class="radio__button" name="speedStatus" value="yesSlow">
                    <label for="slowSpeed">Slowed</label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Reserve Count</legend>
                <input type="number" id="editReserves" class="form__input" name="reserveCount" min="0" max="6" step="1" value="0">
            </fieldset>
            <fieldset>
                <legend>Free Rerolls</legend>
                <input type="number" id="freeRerolls" class="form__input" name="freeRerolls" min="0" max="10" step="1" value="0">
            </fieldset>
            <fieldset>
                <legend>Max Abilities</legend>
                <input type="number" id="maxAbilities-${unit.unitID}" class="form__input" name="maxAbilities-${unit.unitID}" min="1" max="5" step="1" value="1">
            </fieldset>
    </fieldset>
    `;

    // document.getElementById("forceRadioSet-"+self.unitID).addEventListener('change', function(event) {
    //     const selectedValue = event.target.value;
    //     console.log(selectedValue)
    //     console.log(event)
    //     console.error(self)
    //     if (selectedValue === 'regular') {
    //       // Do something for REGULAR option
    //       console.log('Regular option selected');
    //     } else if (selectedValue === 'heroic') {
    //       // Do something for HEROIC option
    //       console.log('Heroic option selected');
    //     } else if (selectedValue === 'elite') {
    //       // Do something for ELITE option
    //       console.log('Elite option selected');
    //     }

    //     if (self.getCurrentType().name == selectedValue.toUpperCase()) { console.log("works"); return; }

    //     //document.getElementById("forceRadioSet-"+self.unitID).querySelector(`.radio__button[value="${selectedValue}"]`).checked = true;
    //     const newType = self.types.find(type => type.name == selectedValue.toUpperCase());

    //     console.log("type test:", self.types.find(type => type.name == selectedValue))
    //     console.log(newType)

    //     changeType(newType, self);
        
    //     setTimeout(() => {
    //         document.getElementById("selfDice-"+self.unitID).value = self.unitDice;
    //         document.getElementById("maxAbilities-"+self.unitID).value = self.maxAbilities;
    //     }, 100); 
    // });

    // document.getElementById("forceRadioSet-"+this.unitID).addEventListener('change', function(event) {
    //     const selectedValue = event.target.value;

    //     if (selectedValue === 'regular') {
    //       // Do something for REGULAR option
    //       console.log('Regular option selected');
    //     } else if (selectedValue === 'heroic') {
    //       // Do something for HEROIC option
    //       console.log('Heroic option selected');
    //     } else if (selectedValue === 'elite') {
    //       // Do something for ELITE option
    //       console.log('Elite option selected');
    //     }
    // });

    // self.types.forEach(type => {
    //     const typeLI = document.createElement('li');
    //     typeLI.textContent = type.name;

    //     //typeLI.onclick = (evt) => clickType(evt, type, self, false);

    //     const tapEvent = new Hammer(typeLI);

    //     tapEvent.on("tap", event => {
    //         if (event.tapCount >= 2) { // Double tap
    //             if (type.isType) { return }

    //             changeType(type, self);
                
    //             setTimeout(() => { // We need a small delay before updating the dom
    //                 document.getElementById("unitDice").value = self.unitDice;
    //                 document.getElementById("maxAbilities").value = self.maxAbilities;
    //             }, 100); 
    //         } else { // Single tap
    //             showDescription(type, defaultText, el);
    //         }
    //     });

    //     currentTypeDisplay.appendChild(typeLI);
        
    //     if (type.isType) {
    //         typeLI.classList.add('selected');
    //         showDescription(type, defaultText, el)
    //     };
    // });

    return section;
};

function updateForceCard(unit) {
    const card = document.getElementById("card-" + unit.unitID);

    // Update FORCE NAME
    card.querySelector("#forceCardName").value = unit.name;

    // Update FORCE TYPE
    const currentVal = getCurrentType(unit).name.toLowerCase();
    card.querySelector(`.radio__button[value="${currentVal}"]`).checked = true;
    
    // Update ABILITIES
    const temp = getCurrentAbilities(unit);
    // console.log(temp)
    const a = temp[0].name === "" ? "Click to open Ability Sheet." : temp[0].name;
    const b = temp[1].name === "" ? "Click to open Ability Sheet." : temp[1].name;
    const c = temp[2].name === "" ? "Click to open Ability Sheet." : temp[2].name;

    console.log(a)
    console.log(b)

    card.querySelector("#abil1Display").textContent = a;
    card.querySelector("#abil2Display").textContent = b;
    card.querySelector("#abil3Display").textContent = c;

    // Update NOTES
    card.querySelector("#forceCardNotes").value = unit.notes;

    // Update STATS
    card.querySelector("#range").value = unit.attackRange;
    card.querySelector(`#unitDice-${unit.unitID}`).value = unit.unitDice;

    // Update HEALTH STATUS
    const healthStatus = unit.isDead ? "isDead" : "notDead";
    card.querySelector(`#${healthStatus}`).checked = true;

    // Update TURN STATUS
    const turnStatus = unit.isTurn ? "yesTurn" : "notTurn";
    card.querySelector(`#${turnStatus}`).checked = true;

    // Update COVER STATUS
    const coverStatus = unit.isCovered ? "hasCover" : "noCover";
    card.querySelector(`#${coverStatus}`).checked = true;

    // Update SPEED STATUS
    const speedStatus = unit.isSlowed ? "slowSpeed" : "normalSpeed";
    card.querySelector(`#${speedStatus}`).checked = true;

    // Update RESERVE COUNT
    card.querySelector("#editReserves").value = unit.reserveCount;

    // Update FREE REROLLS
    card.querySelector("#freeRerolls").value = unit.freeRerolls;

    // Update MAX ABILITIES
    card.querySelector(`#maxAbilities-${unit.unitID}`).value = unit.maxAbilities;
};

// function updateForceCard(unit) {
//     document.getElementById("unitDice-"+unit.unitID).value = unit.unitDice;
//     document.getElementById("maxAbilities-"+unit.unitID).value = unit.maxAbilities;
// }

// function updateForceCard(unit) {
//     const card = document.getElementById("card-"+unit.unitID)
//     // Update FORCE NAME
//     document.getElementById("forceCardName").value = unit.name;

//     // Update FORCE TYPE
//     const forceType = unit.isHeroic ? "isHeroicForce" : (unit.isElite ? "isEliteForce" : "isRegularForce");
//     document.getElementById(forceType + "-" + unit.unitID).checked = true;

//     // Update ABILITIES
//     document.getElementById("abil1Display").textContent = unit.ability1;
//     document.getElementById("abil2Display").textContent = unit.ability2;
//     document.getElementById("abil3Display").textContent = unit.ability3;

//     // Update NOTES
//     document.getElementById("forceCardNotes").value = unit.notes;

//     // Update STATS
//     document.getElementById("range").value = unit.attackRange;
//     document.getElementById("unitDice-" + unit.unitID).value = unit.unitDice;

//     // Update HEALTH STATUS
//     const healthStatus = unit.isDead ? "isDead" : "notDead";
//     document.getElementById(healthStatus).checked = true;

//     // Update TURN STATUS
//     const turnStatus = unit.isTurn ? "yesTurn" : "notTurn";
//     document.getElementById(turnStatus).checked = true;

//     // Update COVER STATUS
//     const coverStatus = unit.isCovered ? "hasCover" : "noCover";
//     document.getElementById(coverStatus).checked = true;

//     // Update SPEED STATUS
//     const speedStatus = unit.isSlowed ? "slowSpeed" : "normalSpeed";
//     document.getElementById(speedStatus).checked = true;

//     // Update RESERVE COUNT
//     document.getElementById("editReserves").value = unit.reserveCount;

//     // Update FREE REROLLS
//     document.getElementById("freeRerolls").value = unit.freeRerolls;

//     // Update MAX ABILITIES
//     document.getElementById("maxAbilities-" + unit.unitID).value = unit.maxAbilities;
// }

