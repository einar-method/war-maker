/************************************************************/
/* A collection of functions that manipulate DOM elements. */
/************************************************************/

function isTouchSupported() {
    return 'ontouchstart' in window;
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
        beginForceCreation();
        //was addUnit()
    });

    return lastCard;
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

function createForceCard(unit) {
    //const self = this;
    const section = document.createElement('section');
    section.classList.add('force__card');
    section.id = `card-${unit.unitID}`;

    section.innerHTML = `
    <div class="force__card__labeled-textareas force-name">
        <p class="war-sheet__paragrapgh">FORCE NAME: </p>
        <textarea id="forceCardName-${unit.unitID}" name="forceCardName-${unit.unitID}" rows="1" class="textarea__dynamic" title="Change Force Name" placeholder="Name your force, or leave blank."></textarea>
        <div class="dropdown">
        <span class="dropbtn force__card__menu-btn">&#9865;</span>
        <div class="dropdown-content">
          <a href="#">Clone</a>
          <a onclick="promptRemoveUnit('card-${unit.unitID}', '${unit.unitID}')">Delete</a>
          <a href="#">Metadata</a>
          <a href="#">Token</a>
        </div>
      </div> 
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
                <p class="force__card__ability-display" onclick="toggleAbilitySheet(this, true, 'force__card')"><span id="abil3Display">Click to open Ability Sheet.</span></p>
            </div>
        </div>
    </div>
    <div>
        <p class="war-sheet__paragrapgh">NOTES: </p>
        <textarea id="forceCardNotes-${unit.unitID}" name="forceCardNotes-${unit.unitID}" rows="3" class="textarea__dynamic" spellcheck="false" title="Extra Force Notes" placeholder="Additional notes for this force."></textarea>
    </div>
    <fieldset class="force__card__stats__container">
        <legend class="force__card__title-bar">STATS:</legend>
            <fieldset class="force__number-set">
                <legend>Attack Zone</legend>
                <label for="range-${unit.unitID}">0 Melee | 1-5 Ranged</label>
                <input type="number" id="range-${unit.unitID}" class="form__input" name="range-${unit.unitID}" min="0" max="5" step="1" value="0">
            </fieldset>
            <fieldset class="force__number-set">
                <legend>Unit Dice</legend>
                <label for="unitDice-${unit.unitID}">Or # of members</label>
                <input type="number" id="unitDice-${unit.unitID}" class="form__input" name="unitDice-${unit.unitID}" min="0" max="6" step="1" value="6">
            </fieldset>
            <fieldset class="force__card__radio-fieldset force__bool-set">
                <legend>Condition</legend>
                <div>
                    <input type="radio" id="notDead-${unit.unitID}" class="radio__button" name="healthStatus-${unit.unitID}" value="alive">
                    <label for="notDead-${unit.unitID}">Alive</label><br>
                </div>
                <div>
                    <input type="radio" id="isDead-${unit.unitID}" class="radio__button" name="healthStatus-${unit.unitID}" value="dead">
                    <label for="isDead-${unit.unitID}">Dead</label>
                </div>
            </fieldset>
            <fieldset class="force__card__radio-fieldset force__bool-set">
                <legend>Activation</legend>
                <div >
                    <input type="radio" id="notTurn-${unit.unitID}" class="radio__button" name="turnStatus-${unit.unitID}" value="inactive">
                    <label for="notTurn-${unit.unitID}">Inactive</label><br>
                </div>
                <div >
                    <input type="radio" id="yesTurn-${unit.unitID}" class="radio__button" name="turnStatus-${unit.unitID}" value="active">
                    <label for="yesTurn-${unit.unitID}">Active</label>
                </div>
            </fieldset>
            <fieldset class="force__card__radio-fieldset force__bool-set">
                <legend>Cover</legend>
                <div>
                    <input type="radio" id="hasCover-${unit.unitID}" class="radio__button" name="coverStatus-${unit.unitID}" value="cover">
                    <label for="hasCover-${unit.unitID}">Has Cover</label><br>
                </div>
                <div>
                    <input type="radio" id="noCover-${unit.unitID}" class="radio__button" name="coverStatus-${unit.unitID}" value="noCover">
                    <label for="noCover-${unit.unitID}">No Cover</label>
                </div>
            </fieldset>
            <fieldset class="force__card__radio-fieldset force__bool-set">
                <legend>Movement</legend>
                <div>
                    <input type="radio" id="normalSpeed-${unit.unitID}" class="radio__button" name="speedStatus-${unit.unitID}" value="noSlow">
                    <label for="normalSpeed-${unit.unitID}">Normal</label><br>
                </div>
                <div>
                    <input type="radio" id="slowSpeed-${unit.unitID}" class="radio__button" name="speedStatus-${unit.unitID}" value="yesSlow">
                    <label for="slowSpeed-${unit.unitID}">Slowed</label>
                </div>
            </fieldset>
            <fieldset class="force__number-set">
                <legend>Reserve Count</legend>
                <input type="number" id="editReserves-${unit.unitID}" class="form__input" name="reserveCount-${unit.unitID}" min="0" max="6" step="1" value="0">
            </fieldset>
            <fieldset class="force__number-set">
                <legend>Free Rerolls</legend>
                <input type="number" id="freeRerolls-${unit.unitID}" class="form__input" name="freeRerolls-${unit.unitID}" min="0" max="10" step="1" value="0">
            </fieldset>
            <fieldset class="force__number-set">
                <legend>Max Abilities</legend>
                <input type="number" id="maxAbilities-${unit.unitID}" class="form__input" name="maxAbilities-${unit.unitID}" min="1" max="5" step="1" value="1">
            </fieldset>
    </fieldset>
    `;

    return section;
};

function updateForceCard(unit) {
    const card = document.getElementById("card-" + unit.unitID);

    // Update FORCE NAME
    card.querySelector(`#forceCardName-${unit.unitID}`).value = unit.name;

    // Update FORCE TYPE
    const currentVal = getCurrentType(unit).name.toLowerCase();
    card.querySelector(`.radio__button[value="${currentVal}"]`).checked = true;
    
    // Update ABILITIES
    const temp = getCurrentAbilities(unit);
    const a = temp[0].name === "" ? "Click to open Ability Sheet." : temp[0].name;
    const b = temp[1].name === "" ? "Click to open Ability Sheet." : temp[1].name;
    const c = temp[2].name === "" ? "Click to open Ability Sheet." : temp[2].name;

    card.querySelector("#abil1Display").textContent = a;
    card.querySelector("#abil2Display").textContent = b;
    card.querySelector("#abil3Display").textContent = c;

    // Update NOTES
    card.querySelector(`#forceCardNotes-${unit.unitID}`).value = unit.notes; // === "" ? "" : unit.notes;

    // Update STATS
    card.querySelector(`#range-${unit.unitID}`).value = unit.attackRange;
    card.querySelector(`#unitDice-${unit.unitID}`).value = unit.unitDice;

    // Update HEALTH STATUS
    const healthStatus = unit.isDead ? `isDead-${unit.unitID}` : `notDead-${unit.unitID}`;
    card.querySelector(`#${healthStatus}`).checked = true;

    // Update TURN STATUS
    const turnStatus = unit.isTurn ? `yesTurn-${unit.unitID}` : `notTurn-${unit.unitID}`;
    card.querySelector(`#${turnStatus}`).checked = true;

    // Update COVER STATUS
    const coverStatus = unit.isCovered ? `hasCover-${unit.unitID}` : `noCover-${unit.unitID}`;
    card.querySelector(`#${coverStatus}`).checked = true;

    // Update SPEED STATUS
    const speedStatus = unit.isSlowed ? `slowSpeed-${unit.unitID}` : `normalSpeed-${unit.unitID}`;
    card.querySelector(`#${speedStatus}`).checked = true;

    // Update RESERVE COUNT
    card.querySelector(`#editReserves-${unit.unitID}`).value = unit.reserveCount;

    // Update FREE REROLLS
    card.querySelector(`#freeRerolls-${unit.unitID}`).value = unit.freeRerolls;

    // Update MAX ABILITIES
    card.querySelector(`#maxAbilities-${unit.unitID}`).value = unit.maxAbilities;
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
                if (!addAbility(ability, self)) {
                    toggle.checked = false;
                } else { toggle.checked = true; return; }
                
            }
            if (isChecked == false) {
                promptRemoveAbility(inner, ability, self, toggle);
            }
        });
    });
};

function toggleAbilitySheet(elm, checker, parentClass) {
    const fullId = findParentByClass(elm, parentClass).id;

    const parentId = fullId[0] === "a" ? fullId.slice("abilitySheet-".length) : fullId.slice("card-".length);

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
