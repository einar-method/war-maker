/************************************************************/
/*    Crucial listeners, variables, and firebase init       */
/************************************************************/
const firebaseConfig = {
      
    apiKey: "AIzaSyA2YxFjYo4W8emc1nBZSOgMQ8yhyadrRrc",

    authDomain: "war-maker.firebaseapp.com",

    databaseURL: "https://war-maker-default-rtdb.firebaseio.com",

    projectId: "war-maker",

    storageBucket: "war-maker.appspot.com",

    messagingSenderId: "772619207902",

    appId: "1:772619207902:web:3d14a7bb5d333df0512e4f"
};

firebase.initializeApp(firebaseConfig);

let playerId;
let playerRef;
let players = {};
let playerElements = {};
let unitRef;
let units = {};
let unitElements = {};

const gameContainer = document.querySelector(".game-container");
const playerNameInput = document.querySelector("#player-name");
//const playerColorButton = document.querySelector("#player-color");
document.getElementById("points-display-box").onclick = editPoints; // Function in playerHandler.js

function initGame() {

    new KeyPressListener("KeyW", () => handleArrowPress(0, -1))
    new KeyPressListener("KeyS", () => handleArrowPress(0, 1))
    new KeyPressListener("KeyA", () => handleArrowPress(-1, 0))
    new KeyPressListener("KeyD", () => handleArrowPress(1, 0))

    const allPlayersRef = firebase.database().ref(`players`);
    const allUnitsRef = firebase.database().ref(`units`);

    allPlayersRef.on("value", (snapshot) => {
        //Fires whenever a change occurs
        players = snapshot.val() || {};
        Object.keys(players).forEach((key) => {
            const characterState = players[key];
            let el = playerElements[key];
            // Now update the DOM
            el.querySelector(".Character_name").innerText = characterState.name;
            // el.querySelector(".Character_coins").innerText = characterState.coins;
            el.setAttribute("data-color", characterState.color);
            el.setAttribute("data-direction", characterState.direction);
            const left = 16 * characterState.x + "px";
            const top = 16 * characterState.y - 4 + "px";
            el.style.transform = `translate3d(${left}, ${top}, 0)`;
        })
    });
    allPlayersRef.on("child_added", (snapshot) => {
        //Fires whenever a new player is added to the tree
        const addedPlayer = snapshot.val();
        const characterElement = document.createElement("div");
        characterElement.classList.add("Character", "grid-cell");
        if (addedPlayer.id === playerId) {
            characterElement.classList.add("you");
        }
        characterElement.innerHTML = (`
            <div class="Character_shadow grid-cell"></div>
            <div class="Character_sprite grid-cell"></div>
            <div class="Character_name-container">
                <span class="Character_name"></span>
            </div>
            <div class="Character_you-arrow"></div>
        `);
        playerElements[addedPlayer.id] = characterElement;

        //Fill in some initial state
        characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
        characterElement.setAttribute("data-color", addedPlayer.color);
        characterElement.setAttribute("data-direction", addedPlayer.direction);
        const left = 16 * addedPlayer.x + "px";
        const top = 16 * addedPlayer.y - 4 + "px";
        characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
        gameContainer.appendChild(characterElement);
        
    });

    //Remove character DOM element after they leave
    allPlayersRef.on("child_removed", (snapshot) => {
        const removedKey = snapshot.val().id;

        gameContainer.removeChild(playerElements[removedKey]);
        delete playerElements[removedKey];
    });

    //Updates player name with text input
    playerNameInput.addEventListener("change", (e) => {
        const newName = e.target.value || createName();
        playerNameInput.value = newName;
        playerRef.update({
            name: newName
        })
    });

    const intervalId = setInterval(() => {
        if (players[playerId] && players[playerId].currentPoints) {
            displayPoints(players[playerId].currentPoints);
            clearInterval(intervalId); 
        } else {
            console.log("Waiting for currentPoints. Retrying in 3 seconds...");
        }
    }, 3000);

    // UNITS
    allUnitsRef.on("value", (snapshot) => {
        //Fires whenever a change occurs
        units = snapshot.val() || {};
        Object.keys(units).forEach((key) => {
            console.log(units[key]) //NOTE: unit is being passed correctly
/*             const characterState = units[key];
            let el = playerElements[key];
            // Now update the DOM
            el.querySelector(".Character_name").innerText = characterState.name;
            // el.querySelector(".Character_coins").innerText = characterState.coins;
            el.setAttribute("data-color", characterState.color);
            el.setAttribute("data-direction", characterState.direction);
            const left = 16 * characterState.x + "px";
            const top = 16 * characterState.y - 4 + "px";
            el.style.transform = `translate3d(${left}, ${top}, 0)`; */
        })
    });

    allUnitsRef.on("child_added", (snapshot) => {
        //Fires whenever a new force is added to the tree
        const addedForce = snapshot.val();

        //console.log(addedForce) //NOTE: unit is being passed correctly
        //const unit = new Force();
        //console.log("Created unit with ID:", unit.unitID);

        const forceElm = createForceCard(addedForce);
        cardContainer.insertBefore(forceElm, cardContainer.lastElementChild); 
        unitElements[addedForce.unitID] = forceElm;
        //console.log(unitElements)  

        const newType = addedForce.types.find(type => type.name === "REGULAR");
        changeType(newType, addedForce);

        //const currentVal = getCurrentType(addedForce).name.toLowerCase();
        //console.log(currentVal)
        //unitElements[addedForce.unitID].querySelector(`.radio__button[value="${currentVal}"]`).checked = true;
        
        const typeRadios = unitElements[addedForce.unitID].querySelector(`.force__type-set`);
        
        setTimeout(() => {
            updateForceCard(addedForce);
        }, 100); 
        


        typeRadios.addEventListener('change', function(event) {
            const selectedValue = event.target.value;
            // console.log(selectedValue)
            // const upper = selectedValue.toUpperCase();
            // console.log(upper)
            // console.log("during this stage:", addedForce.types)
            const newType = addedForce.types.find(type => type.name === selectedValue.toUpperCase());
            console.log("New type", newType)
            console.log("Added force:", addedForce)
            changeType(newType, addedForce);
        })
/* 
        const forceElm = addedForce.createForceCard();
 
        unitElements[addedForce.unitID] = forceElm;

        //Fill in some initial state
        
        // forceElm.querySelector(".Character_name").innerText = addedForce.name;
        // forceElm.setAttribute("data-color", addedForce.color);
        // forceElm.setAttribute("data-direction", addedForce.direction);
        // const left = 16 * addedForce.x + "px";
        // const top = 16 * addedForce.y - 4 + "px";
        // forceElm.style.transform = `translate3d(${left}, ${top}, 0)`;
        cardContainer.insertBefore(forceElm, cardContainer.lastElementChild); 

        const currentVal = addedForce.getCurrentType().name.toLowerCase();
        document.getElementById("forceRadioSet-"+addedForce.unitID).querySelector(`.radio__button[value="${currentVal}"]`).checked = true;


        document.getElementById("forceRadioSet-"+addedForce.unitID).addEventListener('change', function(event) {
            const selectedValue = event.target.value;
            //console.log(selectedValue)
            //console.log(event)
            //console.error(unit)
    
            if (selectedValue === 'regular') {
              // Do something for REGULAR option
              addedForce.types[0].isType = true;
              console.log('Regular option selected');
            } else if (selectedValue === 'heroic') {
              // Do something for HEROIC option
              addedForce.types[1].isType = true;
              console.log('Heroic option selected');
            } else if (selectedValue === 'elite') {
              // Do something for ELITE option
              addedForce.types[2].isType = true;
              console.log('Elite option selected');
            }
    
            if (addedForce.getCurrentType().name == selectedValue.toUpperCase()) { console.log("works"); return; }
    
            //document.getElementById("forceRadioSet-"+unit.unitID).querySelector(`.radio__button[value="${selectedValue}"]`).checked = true;
            const newType = addedForce.types.find(type => type.name == selectedValue.toUpperCase());
    
            //console.log("type test:", unit.types.find(type => type.name == selectedValue))
            
            console.error(unit)
    
            changeType(newType, unit);
            // Update unit on server
            //updateUnitOnServer(unit);
            
            setTimeout(() => {
                document.getElementById("unitDice-"+addedForce.unitID).value = addedForce.unitDice;
                document.getElementById("maxAbilities-"+addedForce.unitID).value = addedForce.maxAbilities;
            }, 100); 
        }); */
        
    });
};

// Create Lobby button
document.getElementById("makeLobby").addEventListener("click", function() {
    const code = getHash();
    console.log("Lobby code created:", code)
    createLobby(code);
});

// Join Lobby button
const codeInput = document.getElementById("joinLobby");
codeInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const code = codeInput.value;
        console.log("attempting to join a group with code:", code)
        joinLobby(code);
    }
});

// Sending messages
const messageInput = document.getElementById('msgInput');
messageInput.addEventListener('keydown', function (event) {
    const messageText = messageInput.value.trim();
    if (event.key === 'Enter' && messageText !== '') {
        sendMessage(messageText);
        messageInput.value = '';
    }
});
   
const database = firebase.database();

firebase.auth().onAuthStateChanged((user) => {
    //console.log(user)
    // need to add a try or check here for when null
    if (user) {
    //User logged in
    playerId = user.uid;
    playerRef = firebase.database().ref(`players/${playerId}`);

    const name = createName();
    playerNameInput.value = name;

    const {x, y} = getRandomSafeSpot();


    playerRef.set({
        id: playerId,
        name,
        direction: "right",
        color: randomFromArray(playerColors),
        x,
        y,
        currentPoints: 40,
        canEdit: true,
        units: [],
        currentLobby: null,
    })

    //Remove user from Firebase when diconnected
    playerRef.onDisconnect().remove();

    // Bootup after sign in
    initGame();
    } else {
    // Log out
    }
});

// Handle some auth errors
firebase.auth().signInAnonymously().catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    
    console.log(errorCode, errorMessage);
});

//const scrollTop2 = document.getElementById("top");

// Make the Add Unit interactive card for users
const cardContainer = document.getElementById('cardContainer');
document.getElementById('cardContainer').appendChild(createAddCard());

// For navigation functionality
document.addEventListener("DOMContentLoaded", function () {

    // Get all anchor elements within the navigation
    const navLinks = document.querySelectorAll('nav a');

    // Attach a click event listener to each anchor
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            //event.preventDefault();

            // Get the target section ID from the href attribute
            const targetSectionId = link.getAttribute('href').substring(1);

            // Get all sections with the class "page"
            const sections = document.querySelectorAll('.page');

            // Iterate through each section
            sections.forEach(function (section) {
                // Check if the section matches the target ID
                if (section.id === targetSectionId) {
                    section.style.display = "grid";
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});

// For our expandable boxes
document.body.addEventListener("click", (evt) => {
    //closeBoxes(evt)
    const isExand = !!evt.target.closest(".expandable__title-bar");
    const expand = evt.target.closest(".expandable");

    // check if expand bar
    if (!isExand) {
        return;
    }
    // expand bar clicked
    expand.classList.toggle("expandable--open");

    // Find the icon element within the clicked expandable
    const icon = evt.target.closest(".expandable__title-bar").querySelector(".expandable__icon");

    // Check if the expandable is open and update the icon accordingly
    if (expand.classList.contains("expandable--open")) {
        icon.style.opacity = 0;
        setTimeout(() => {
            icon.setAttribute("name", "chevron-expand");
            icon.style.opacity = 1;
        }, 300);
    } else {
        icon.style.opacity = 0;
        setTimeout(() => {
            icon.setAttribute("name", "chevron-collapse");
            icon.style.opacity = 1;
        }, 300);
    }
});

window.onload = function() {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    const element = document.querySelector('a[href="#hub"]');

    if (element) {
        setTimeout(() => {
            element.click();
        }, 100); 
    }

    handleRouting();

    // Prevent autocomplete and spellcheck on all user inputs
    const forms = document.querySelectorAll('form');
    const textareas = document.querySelectorAll('textarea');
    const inputs = document.querySelectorAll('input');

    forms.forEach(function(form) {
        form.setAttribute('autocomplete', 'off');
        form.setAttribute('spellcheck', 'false');
        //console.log(form)
    });

    textareas.forEach(function(textarea) {
        textarea.setAttribute('autocomplete', 'off');
        textarea.setAttribute('spellcheck', 'false');
        textarea.value = "";
        //console.log(textarea)
    });

    inputs.forEach(function(input) {
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('spellcheck', 'false');
        //console.log(input)
    });

    // Open welocme page login default tab
    //document.getElementById("tiredOfIds").click();
}; // We might want to wrap all function on this page here

// Disable Right Click
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});

// Accordions
const accordian = document.getElementsByClassName("accordion");
//const defaultTabs = document.getElementsByClassName("tab__default");

for (i = 0; i < accordian.length; i++) {
    const defaultTabs = accordian[i].nextElementSibling.getElementsByClassName("tab__link tab__default");

    accordian[i].addEventListener("click", function() {
        this.classList.toggle("active");
        defaultTabs[0].click();
 
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    });
}

// Tabs
function flipTab(evt, inputId) {
    const parentElement = document.getElementById(inputId).parentNode;
  
    // Hide all tab content
    const tabContent = parentElement.getElementsByClassName("tab__content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    const tabLinks = parentElement.getElementsByClassName("tab__link");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(inputId).style.display = "block";
    evt.currentTarget.className += " active";
};

// Testing
let isP1Automated = true;
let isP2Automated = true;
let war0;
function step1() {
    console.log("step 1 done")
    // document.getElementById("log1").innerHTML = "step 1 done"

    war0 = new War();
    console.log(war0);

    war0.commanders.push(new AICommander(createName(), null, { side: 1, color: "green"}));
    war0.commanders.push(new AICommander(createName(), null, { side: 2, color: "red"}));
    
    const commander1 = war0.commanders[0]; //.name + " starts with " + war0.commanders[0].allForces.length + " total forces."

    console.log("Player 1's name: " + commander1.name)
    console.log(commander1.name + "'s tactics | " + commander1.tacticsText)
    console.log(commander1.name + "'s personality | " + commander1.personalityText)
    console.log(commander1.name + " starts with " + war0.commanders[0].allForces.length + " total forces.")

    const commander2 = war0.commanders[1];
    console.log("Player 2's name: " + commander2.name)
    console.log(commander2.name + "'s tactics | " + commander2.tacticsText)
    console.log(commander2.name + "'s personality | " + commander2.personalityText)
    console.log(commander2.name + " starts with " + war0.commanders[0].allForces.length + " total forces.")
 

    war0.generateRandomWar();
    // document.getElementById("log1").innerHTML += "<br><br>✔️ "+battle.txt;
    // document.getElementById("log1").innerHTML += "<br>✔️ "+battle.bat;
    // document.getElementById("log1").innerHTML += "<br>✔️ "+battle.p1;
    // document.getElementById("log1").innerHTML += "<br>✔️ "+battle.p2;

    console.log(war0.spark.description1)
    console.log(war0.spark.description2)
    console.log(war0.retaliate.description1)
    console.log(war0.retaliate.description2)
    console.log(war0.openWar.description1)
    console.log(war0.openWar.description2)
    console.log(war0.finalFront.description1)
    console.log(war0.finalFront.description2)

    document.getElementById("warP1Span").value = commander1.name;
    document.getElementById("warP2Span").value = commander2.name;
    
    document.getElementById("sparkStorySpan").value = war0.spark.description1 + " " + war0.spark.description2;
    document.getElementById("retaliationStorySpan").value = war0.retaliate.description1 + " " + war0.retaliate.description2;
    document.getElementById("openWarStorySpan").value = war0.openWar.description1 + " " + war0.openWar.description2;
    document.getElementById("finalFrontStorySpan").value = war0.finalFront.description1 + " " + war0.finalFront.description2;


}
