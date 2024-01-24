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

// TODO: Rename the below id
//document.getElementById("points-display-box").onclick = editPoints; // Function in playerHandler.js

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
            //console.log(unitElements[units[key].unitID]) //NOTE: unit is being passed correctly
            if (units[key].owner === playerId) {
                setTimeout(() => {
                    updateForceCard(units[key]);
                }, 100); 
            } else { console.log("this was not my update") }
        })
    });

    allUnitsRef.on("child_added", (snapshot) => {
        //Fires whenever a new force is added to the tree
        console.log(playerId)
        // const playerOwner = snapshot.val();
        // if (playerOwner.owner === playerId) {
        //     console.log("I own this!")
        // } else { console.error("I DONT own this!") }


    //     const currentUser = firebase.auth().currentUser;
    //     console.log(currentUser)
    //     console.log(currentUser.uid)
    //     const userLobbyRef = firebase.database().ref(`players/${currentUser.uid}`);
    //     console.log(userLobbyRef.id)

    // if (currentUser) {
        const addedForce = snapshot.val();
        if (addedForce.owner === playerId) {
            console.log("I own this!")
        

        const forceElm = createForceCard(addedForce);
        cardContainer.insertBefore(forceElm, cardContainer.lastElementChild); 
        unitElements[addedForce.unitID] = forceElm;

        const newType = addedForce.types.find(type => type.name === "REGULAR");
        changeType(newType, addedForce);
        
        const typeRadios = unitElements[addedForce.unitID].querySelector(`.force__type-set`);
        typeRadios.addEventListener('change', function(event) {
            const selectedValue = event.target.value;
  
            const newType = addedForce.types.find(type => type.name === selectedValue.toUpperCase());
 
            changeType(newType, units[addedForce.unitID]);
        });

        const boolRadios = unitElements[addedForce.unitID].querySelectorAll(`.force__bool-set`);
        boolRadios.forEach((item) => {
            item.addEventListener('change', function(event) {     
                checkRadios(event.target.id, units[addedForce.unitID]);
                updateUnitOnServer(units[addedForce.unitID]);
            });
        });

        const textAreas = unitElements[addedForce.unitID].querySelectorAll(`.textarea__dynamic`);
        textAreas.forEach((item) => {
            item.addEventListener('blur', function (event) {
                checkInputChange(event.target, units[addedForce.unitID]);
                updateUnitOnServer(units[addedForce.unitID]);
            });
        });

        const numberInputs = unitElements[addedForce.unitID].querySelectorAll(`.force__number-set`);
        numberInputs.forEach((item) => {
            item.addEventListener('input', function (event) {
                checkInputChange(event.target, units[addedForce.unitID]);
                updateUnitOnServer(units[addedForce.unitID]);
            });
        });
    //}
    } else { console.log("I DONT own this!") }
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

// Make the Add Unit interactive card for users
const cardContainer = document.getElementById('cardContainer');
//document.getElementById('cardContainer').appendChild(createAddCard());

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

/*   // Prevent autocomplete and spellcheck on all user inputs
    // Still useful but we no longer have these elements created when the window first loads
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
    }); */

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
};



function removeAll() {
    graph.dispose();
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
}
function removeRndPoint() {
    if (graph.points.length == 0) {
        console.log("no points")
        return;
    }
    const index = Math.floor(Math.random() * graph.points.length);
    graph.removePoint(graph.points[index]);
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
    //console.log(success);
};

function removeRndSegment() {
    if (graph.segments.length == 0) {
        console.log("no segments")
        return;
    }
    const index = Math.floor(Math.random() * graph.segments.length);
    graph.removeSegment(graph.segments[index]);
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
    //console.log(success);
};

function addRandomSegment() {
    const index1 = Math.floor(Math.random() * graph.points.length);
    const index2 = Math.floor(Math.random() * graph.points.length);
    const success = graph.tryAddSegment(
        new Segment2(graph.points[index1], graph.points[index2])
    );
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
    console.log(success);
};

function addRandomPoint() {
    const success = graph.tryAddPoint(
        new Point2(
            Math.random() * myCanvas.width,
            Math.random() * myCanvas.height
        )
    );
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
    console.log(success);
};
const GRID_SIZE = 45;
const myCanvas = document.getElementById("myCanvas")
myCanvas.width = 400;
myCanvas.height = 400;

const ctx = myCanvas.getContext("2d");

const p1 = new Point2(50, 50);
const p2 = new Point2(100, 50);
const p3 = new Point2(150, 50);
const p4 = new Point2(200, 50);
// const p5 = new Point(50, 100);
// const p6 = new Point(100, 100);
// const p7 = new Point(150, 100);
// const p8 = new Point(200, 100);

const s1 = new Segment2(p1, p2);
const s2 = new Segment2(p1, p3);
const s3 = new Segment2(p1, p4);
const s4 = new Segment2(p2, p3);

const graph = new Graph2([p1, p2, p3, p4], [s1, s2, s3, s4]);
const graphEditor = new GraphEditor2(myCanvas, graph);

animate();

function animate() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graphEditor.display();
    requestAnimationFrame(animate);
}
