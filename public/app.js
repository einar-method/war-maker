
function handleRouting() {
    const path = window.location.pathname;
  
    if (path === '/' || path === "/public/") {
      // Handle the main page logic
      console.log('Navigated to the main page');
    } else if (path.startsWith('/join/')) {
      // Extract the lobby ID and handle join logic
      const lobbyId = path.substring('/join/'.length);
      console.log(`Joining lobby with ID: ${lobbyId}`);
    } else {
      // Handle other routes or show a 404 page
      console.log(`Unknown route: ${path}`);
    }
  }
  


const mapData = {
    minX: 1,
    maxX: 14,
    minY: 4,
    maxY: 12,
    blockedSpaces: {
      "7x4": true,
      "1x11": true,
      "12x10": true,
      "4x7": true,
      "5x7": true,
      "6x7": true,
      "8x6": true,
      "9x6": true,
      "10x6": true,
      "7x9": true,
      "8x9": true,
      "9x9": true,
    },
};
  
// Options for Player Colors... these are in the same order as our sprite sheet
const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

//Misc Helpers
function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function getKeyString(x, y) {
    return `${x}x${y}`;
}

function createName() {
    const prefix = randomFromArray([
        "RED",
        "BLUE",
        "YELLOW",
        "GREEN",
        "ORANGE",
        "PURPLE",
        "BROWN",
        "BLACK",
        "WHITE",
        "GRAY",
        "PINK",
        "CYAN",
        "MAGENTA",
        "COPPER",
        "TEAL",
        "OLIVE",
        "MAROON",
        "NAVY",
        "AQUA",
        "SILVER",
        "GOLDEN",
        "INDIGO",
        "VIOLET",
        "TAN",
        "CORAL",
        "CRIMSON",
        "TURQUOISE",
        "KHAKI",
        "BRONZE",
        "BEIGE"
    ]);

    const animal = randomFromArray([
        "WOLF",
        "JACKAL",
        "FOX",
        "HOUND",
        "EAGLE",
        "HAWK",
        "FALCON",
        "OWL",
        "DOLPHIN",
        "WHALE",
        "MANTA",
        "SHARK",
        "BEAR",
        "DOG",
        "CAT",
        "LAMB",
        "LION",
        "BOAR",
        "GOAT",
        "VOLE",
        "SEAL",
        "PUMA",
        "MULE",
        "BULL",
        "BIRD",
        "BUG"
    ]);

    const num = Math.floor(Math.random() * 100) + 1;
    return `${prefix}-${animal}-${num}`;
}

function isSolid(x,y) {

    const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
    return (
        blockedNextSpace ||
        x >= mapData.maxX ||
        x < mapData.minX ||
        y >= mapData.maxY ||
        y < mapData.minY
    )
}

function getRandomSafeSpot() {
//We don't look things up by key here, so just return an x/y
    return randomFromArray([
        { x: 1, y: 4 },
        { x: 2, y: 4 },
        { x: 1, y: 5 },
        { x: 2, y: 6 },
        { x: 2, y: 8 },
        { x: 2, y: 9 },
        { x: 4, y: 8 },
        { x: 5, y: 5 },
        { x: 5, y: 8 },
        { x: 5, y: 10 },
        { x: 5, y: 11 },
        { x: 11, y: 7 },
        { x: 12, y: 7 },
        { x: 13, y: 7 },
        { x: 13, y: 6 },
        { x: 13, y: 8 },
        { x: 7, y: 6 },
        { x: 7, y: 7 },
        { x: 7, y: 8 },
        { x: 8, y: 8 },
        { x: 10, y: 8 },
        { x: 8, y: 8 },
        { x: 11, y: 4 },
    ]);
};

function displayPoints(ref) {
    document.getElementById("points-display").innerHTML = ref;
};


(function () {

    let playerId;
    let playerRef;
    let players = {};
    let playerElements = {};

    const gameContainer = document.querySelector(".game-container");
    const playerNameInput = document.querySelector("#player-name");
    //const playerColorButton = document.querySelector("#player-color");
    document.getElementById("points-display-box").onclick = editPoints;

    function handleArrowPress(xChange=0, yChange=0) {
        const newX = players[playerId].x + xChange;
        const newY = players[playerId].y + yChange;
        if (!isSolid(newX, newY)) {
        //move to the next space
        players[playerId].x = newX;
        players[playerId].y = newY;
        if (xChange === 1) {
            players[playerId].direction = "right";
        }
        if (xChange === -1) {
            players[playerId].direction = "left";
        }
        playerRef.set(players[playerId]);
        }
    }

    function initGame() {
        class KeyPressListener {
            constructor(keyCode, callback) {
              let keySafe = true;
              this.keydownFunction = function(event) {
                if (event.code === keyCode) {
                   if (keySafe) {
                      keySafe = false;
                      callback();
                   }  
                }
             };
             this.keyupFunction = function(event) {
                if (event.code === keyCode) {
                   keySafe = true;
                }         
             };
             document.addEventListener("keydown", this.keydownFunction);
             document.addEventListener("keyup", this.keyupFunction);
            }
          
            unbind() { 
              document.removeEventListener("keydown", this.keydownFunction);
              document.removeEventListener("keyup", this.keyupFunction);
            }
          
          
        };

        new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1))
        new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1))
        new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0))
        new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0))

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
        })
        allPlayersRef.on("child_added", (snapshot) => {
            //Fires whenever a new node is added the tree
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
            
        })

        //Remove character DOM element after they leave
        allPlayersRef.on("child_removed", (snapshot) => {
            const removedKey = snapshot.val().id;

            gameContainer.removeChild(playerElements[removedKey]);
            delete playerElements[removedKey];
        })

        //Updates player name with text input
        playerNameInput.addEventListener("change", (e) => {
            const newName = e.target.value || createName();
            playerNameInput.value = newName;
            playerRef.update({
                name: newName
            })
        })

        setTimeout(() => {
            displayPoints(players[playerId].currentPoints);
        }, 3000);
    };

    // document.getElementById("make-lobby").addEventListener("click", function() {
    //     createAndListenToLobby();
    // });

    // function createAndListenToLobby() {
    //     // Generate a random string for the lobby ID
    //     const lobbyId = getHash();
    
    //     // Get the current user's ID
    //     const userId = firebase.auth().currentUser.uid;
    
    //     // Reference to the lobby in the Realtime Database
    //     const lobbyRef = firebase.database().ref(`lobbies/${lobbyId}`);
    
    //     // Set up onDisconnect for the lobby
    //     lobbyRef.onDisconnect().remove();
    
    //     // Check if the lobby already exists (to avoid collisions)
    //     lobbyRef.once('value', (snapshot) => {
    //         if (!snapshot.exists()) {
    //             // The lobby does not exist, create it
    //             lobbyRef.set({
    //                 user1: userId,
    //                 user2: null,
    //                 createdAt: firebase.database.ServerValue.TIMESTAMP
    //             });
    
    //             // Update the HTML to display the lobby link
    //             const lobbyLabel = document.getElementById("lobby-label");
    //             lobbyLabel.innerText = `Lobby Link: ${window.location.origin}/join/${lobbyId}`;
    //             console.log(`Lobby created with ID: ${lobbyId}`);
    
    //             // Listen for changes in the lobby data
    //             lobbyRef.on('value', (snapshot) => {
    //                 const lobbyData = snapshot.val();
    
    //                 // Check if the lobby exists
    //                 if (lobbyData) {
    //                     const user1ConnectedRef = firebase.database().ref(`players/${lobbyData.user1}`);
    //                     const user2ConnectedRef = firebase.database().ref(`players/${lobbyData.user2}`);
    
    //                     // Set up onDisconnect for user1
    //                     user1ConnectedRef.onDisconnect().remove();
    
    //                     // Set up onDisconnect for user2
    //                     user2ConnectedRef.onDisconnect().remove();
    //                 }
    //             });

    //         } else {
    //             console.error(`Error: Lobby ID ${lobbyId} already exists. Try again.`);
    //         }
    //     });

    // };

    // document.getElementById("join-lobby").addEventListener("click", function() {
    //     console.log("Entered lobby ID:", document.getElementById('lobbyIdInput').value);
    //     joinLobby(document.getElementById('lobbyIdInput').value);
    // });
    // function joinLobby(lobbyId) {

    //     //onclick="joinLobby(document.getElementById('lobbyIdInput').value)"
    //     const userId = firebase.auth().currentUser.uid;
    //     const lobbyRef = firebase.database().ref(`lobbies/${lobbyId}`);
    
    //     // Check if the lobby exists
    //     lobbyRef.once('value', (snapshot) => {
    //         if (snapshot.exists()) {
    //             // Check if user2 is not already set
    //             if (!snapshot.child('user2').exists()) {
    //                 // Set user2 to the current user ID
    //                 lobbyRef.child('user2').set(userId);
    //                 console.log(`User ${userId} joined lobby ${lobbyId}`);
    //             } else {
    //                 console.error(`Error: Lobby ${lobbyId} is already full.`);
    //             }
    //         } else {
    //             console.error(`Error: Lobby ${lobbyId} does not exist.`);
    //         }
    //     });
    // };

    document.getElementById("make-group").addEventListener("click", function() {
        const code = getHash();
        console.log("Lobby code created:", code)
        createMessageGroup(code);
    });

    // Function to create a new message group
    function createMessageGroup(groupName) {
        // Generate a random string for the lobby ID
        const lobbyId = groupName;
    
        // Get the current user's ID
        const userId = firebase.auth().currentUser.uid;
    
        // Reference to the lobby in the Realtime Database
        const lobbyRef = firebase.database().ref(`messageGroups/${lobbyId}`);
    
        // Set up onDisconnect for the lobby
        lobbyRef.onDisconnect().remove();
    
        // Check if the lobby already exists (to avoid collisions)
        lobbyRef.once('value', (snapshot) => {

            if (!snapshot.exists()) {
                // The group does not exist, create it
                lobbyRef.set({
                    members: [userId],
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });
            }
        });

        playerRef.update({
            currentLobby: lobbyId,
        })

        sendMessage("Your sharable lobby code is: " + groupName);
    };

    document.getElementById("join-group").addEventListener("click", function() {
        const code = document.getElementById('groupIdInput').value;
        console.log("attempting to join a group with code:", code)
        joinMessageGroup(code);
    });

    // Function to join a message group using an invite code
    function joinMessageGroup(groupId) {
        console.log("Group code:", groupId)
        console.log("Joining player ID:", playerId)
        // Get a reference to the messageGroups node in the database
        const messageGroupsRef = firebase.database().ref('messageGroups');
    
        // Check if the groupId exists
        messageGroupsRef.child(groupId).once('value')
        .then((snapshot) => {
            const groupData = snapshot.val();
    
            // Check if the groupId is valid
            if (groupData) {
            // Check if the current user is already a member of the group
            if (groupData.members && groupData.members.includes(playerId)) {
                console.log('You are already a member of this group.');
            } else {
                // Add the current user to the group members
                const updatedMembers = (groupData.members || []).concat(playerId);
                
                // Update the database with the new members list
                messageGroupsRef.child(groupId).child('members').set(updatedMembers);

                playerRef.update({
                    currentLobby: groupId,
                });
    
                console.log("Successfully joined lobby: " + groupId);
                sendMessage("Has joined lobby:", groupId);
            }
            } else {
            console.log('Invalid group ID. Please check and try again.');
            }
        })
        .catch((error) => {
            console.error('Error joining group:', error);
        });
    };
  
    function sendMessage(text) {
        const chatFeed = document.getElementById('chat-feed');
        const currentUser = firebase.auth().currentUser;
    
        if (currentUser) {
            const userLobbyRef = firebase.database().ref(`players/${currentUser.uid}`);
    
            userLobbyRef.once('value')
                .then((snapshot) => {
                    const userLobbyData = snapshot.val();
    
                    if (userLobbyData && userLobbyData.currentLobby) {
                        const currentGroupId = userLobbyData.currentLobby;
    
                        const messageData = {
                            userId: currentUser.uid,
                            text: text,
                            timestamp: firebase.database.ServerValue.TIMESTAMP,
                        };
    
                        // Push the message under the currentGroupId
                        const messagesRef = firebase.database().ref(`messageGroups/${currentGroupId}/messages`);
                        
                        // Detach previous event listener to avoid receiving messages twice
                        messagesRef.off('child_added');
    
                        messagesRef.push(messageData);  
    
                        // Add a new event listener to handle the child_added event
                        messagesRef.limitToLast(1).on('child_added', (snapshot) => {
                            const message = snapshot.val();
    
                            // Display the most recent message in the chat feed
                            if (message) {
                                const messageElement = document.createElement('p');
    
                                const senderId = message.userId;
                                const senderRef = firebase.database().ref(`players/${senderId}`);
                                
                                senderRef.once('value', (senderSnapshot) => {
                                    const senderData = senderSnapshot.val();
                            
                                    if (senderData && senderData.name) {
                                        // Display the sender's name along with the most recent message text
                                        messageElement.textContent = `${senderData.name}: ${message.text}`;
                                        chatFeed.appendChild(messageElement);
                                        console.log(`User ${senderData.name} sent the message:`, message.text);
                                    }
                                });
                            }
                        });
    
                    } else {
                        console.error('Unable to send message: No current group ID available for the user.');
                    }
                })
                .catch((error) => {
                    console.error('Error getting current group ID:', error);
                });
        } else {
            console.error('Unable to send message: No authenticated user.');
        }
    };
  
    // Event listener for sending a message
    document.getElementById('send-msg').addEventListener('click', function () {
        const messageInput = document.getElementById('msgInput');
        const messageText = messageInput.value.trim();

        if (messageText !== '') {
            sendMessage(messageText);
            messageInput.value = '';
        }
    });
  
  
  
  







  
    
    const database = firebase.database();

    // Simple add unit function. WIP: need to handle errors 
    function addUnitForDatabase (unit) {
        return database.ref('units/' + unit.unitID).set(unit);
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
    }
    
    firebase.auth().onAuthStateChanged((user) => {
        console.log(user)
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
    })

    firebase.auth().signInAnonymously().catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        console.log(errorCode, errorMessage);
    });



  























const scrollTop = document.getElementById("top");
   



function getCardID(input) {
    // Retrieve the unitID from the clicked DOM element
    const clickedUnitID = input;

    // Use the find method to find the object with a matching unitID
    const matchingUnit = allUnits.find(unit => unit.unitID == clickedUnitID);

    if (matchingUnit) {
        return matchingUnit;
    } else {
        console.log("No matching unit found");
    }
}; // probably not needed now that we pass the unit with edit

function handleImageUpload(input, unit, target) {
    const file = input.files[0];

    const imageElement = target.querySelector('.card-img');
    if (!file || !imageElement) {
        console.log("No image uploaded.")
        return;
    }

    const reader = new FileReader();

    if (imageElement) {
        const parentSection = imageElement.closest('section');

        if (parentSection && parentSection.id === "card-" + unit.unitID) {
            reader.onload = function (e) {
                if (imageElement && imageElement instanceof HTMLImageElement) {
                    if (reader && reader.readyState === FileReader.DONE) {
                        imageElement.src = e.target.result;

                        console.log("Old image src:", unit.imageSrc)
                        unit.imageSrc = e.target.result;
                        console.log("New image src:", unit.imageSrc)
                    } else {
                        console.error("Invalid FileReader state");
                        return;
                    }
                } else {
                    console.error("Invalid image element");
                    return;
                }
            };
            reader.readAsDataURL(file);
        } else {
            // The imageElement does not belong to the expected section
            // Handle other logic or provide feedback
            console.error("Matching error")
        }
    }
};
 
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

function deleteCreatedElements() {
    // Get references to the top-level containers
    const editOverlay = document.getElementById('editOverlay');
    
    // Check if the elements exist before attempting to delete them
    if (editOverlay) {
        // Remove the editOverlay element and its children
        editOverlay.parentNode.removeChild(editOverlay);
    }
}


// Testing variables
class Player {
    constructor() {
        this.currentPoints = 40;
        this.allUnits = [];
        this.name = "Scotty";
        this.canEdit = true;
    }
}

const p1 = new Player();



function getCapLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet.charAt(randomIndex);
};
function getSmallLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet.charAt(randomIndex);
};
function getSymbol() {
    // since we are also using this for dom IDs, had to remove fun characters
    const symbols = "_-123456789abcdefghijklmnopqrstuvwxyz";
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols.charAt(randomIndex);
};

function getHash() {
    const final = [];
    for (let i = 0; i < 10; i++) {
        const num = Math.floor(Math.random() * 5);
    
        const part = 
            num === 0 ? Math.floor(Math.random() * 100) :
            num === 1 ? getCapLetter() :
            num === 2 ? Math.floor(Math.random() * 9) :
            num === 3 ? getSymbol() :
            getSmallLetter(); 
    
        final.push(part);
    }

    // Fisher-Yates shuffle
    for (let i = final.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [final[i], final[j]] = [final[j], final[i]];
    }

    return final.join("");
}

const defaultImages = [
    "./assets/imgs/arturius token.png",
    "./assets/imgs/beetle man card.png",
    "./assets/imgs/beetle man token.png",
    "./assets/imgs/centurion token.png",
    "./assets/imgs/commando token 1b.png",
    "./assets/imgs/commando token 5d.png",
    "./assets/imgs/elram token.png",
    "./assets/imgs/evo suit token.png",
    "./assets/imgs/garvin token.png",
    "./assets/imgs/gunslinger token.png",
    "./assets/imgs/halo team fighter token.png",
    "./assets/imgs/halo team shield token.png",
    "./assets/imgs/iradrum outcast card.png",
    "./assets/imgs/oak walker card.png",
    "./assets/imgs/orc smile mantis blade token.png",
    "./assets/imgs/reptoid cyborg card.png",
    "./assets/imgs/reptoid token gunner.png",
    "./assets/imgs/rhino token.png",
    "./assets/imgs/riva token.png",
    "./assets/imgs/slayer token.png",
    "./assets/imgs/token ghost.png",
    "./assets/imgs/token helm.png",
    "./assets/imgs/vigg card.png"
];

class Force {
    constructor(faction, num, { x = 0, y = 0} = {}, { side = null, color = null } = {}) {
        this.unitID =  getHash();
        this.owner = null;
        this.ownerRef = null;
        this.imageSrc = null;
        this.unitDice = 0;
        this.name = "";
        this.isIntializing = true;
        this.abilities = [
        {
            name: "AGILE",
            hasAbility: false,
            abilityID: 1,
            cost: 3,
            description: "Ignore ROUGH terrain."
        },
        {
            name: "ARTILLERY",
            hasAbility: false,
            abilityID: 2,
            cost: 3,
            description: "When HITS are rolled on a ranged attack, divide them in any array between targets in range."
        },
        {
            name: "ARMOR",
            hasAbility: false,
            abilityID: 3,
            cost: 3,
            description: "Re-roll HITS against this FORCE."
        },
        {
            name: "BUILDERS",
            hasAbility: false,
            abilityID: 4,
            cost: 3,
            description: "This FORCE can spend its turn to create a piece of BLOCK terrain. The new terrain is placed in contact with the BUILDERS."
        },
        {
            name: "BANNER",
            hasAbility: false,
            abilityID: 5,
            cost: 3,
            description: "Allies attacking this FORCE’s target re-roll MISSES."
        },
        {
            name: "BERZERK",
            hasAbility: false,
            abilityID: 6,
            cost: 3,
            description: "When using CHARGE, re-roll MISSES."
        },
        {
            name: "BOLSTER",
            hasAbility: false,
            abilityID: 7,
            cost: 3,
            description: "Use a turn to store 1 die. Give this die to any allied FORCE, use on any future roll."
        },
        {
            name: "DEMOLISH",
            hasAbility: false,
            abilityID: 8,
            cost: 3,
            description: "If in range of a terrain feature, roll 3 HITS to destroy that feature completely, removing it from battle."
        },
        {
            name: "DEFLECT",
            hasAbility: false,
            abilityID: 9,
            cost: 3,
            description: "Use a turn to store 1 die. Expend this die to absorb 1 single attack in the future, no matter its number of HITS."
        },
        {
            name: "EVASIVE",
            hasAbility: false,
            abilityID: 10,
            cost: 3,
            description: "Ranged attacks cannot hit this FORCE."
        },
        {
            name: "FAST",
            hasAbility: false,
            abilityID: 11,
            cost: 3,
            description: "Add a pencil to any movement rule when moving this FORCE."
        },
        {
            name: "FLIGHT",
            hasAbility: false,
            abilityID: 12,
            cost: 3,
            description: "This monster can leap or fly. It always DASHES, even when in a CHARGE, and goes over any terrain in its path."
        },
        {
            name: "FURY",
            hasAbility: false,
            abilityID: 13,
            cost: 3,
            description: "If this FORCE makes at least 1 HIT with an attack, it can attack again."
        },
        {
            name: "HEAT VISION",
            hasAbility: false,
            abilityID: 14,
            cost: 3,
            description: "Ignore the effect of COVER on your targets."
        },
        {
            name: "INTERVENTION",
            hasAbility: false,
            abilityID: 15,
            cost: 3,
            description: "If an ally within 1 pencil is attacked, move there instantly and take the attack. Use only before HIT dice are rolled."
        },
        {
            name: "MARKSMAN",
            hasAbility: false,
            abilityID: 16,
            cost: 3,
            description: "Re-roll MISSES on all ranged attacks."
        },
        {
            name: "MASSIVE",
            hasAbility: false,
            abilityID: 17,
            cost: 3,
            description: "This FORCE functions as BLOCK terrain. ***"
        },
        {
            name: "MELEE REFLEXES",
            hasAbility: false,
            abilityID: 18,
            cost: 3,
            description: "At the start of your turn, roll 3 HIT dice against any 1 enemy FORCE currently in contact."
        },
        {
            name: "POWER UP",
            hasAbility: false,
            abilityID: 19,
            cost: 3,
            description: "Use a turn to store 1 die. Use that die on any roll in future turns.***"
        },
        {
            name: "RALLY POINT",
            hasAbility: false,
            abilityID: 20,
            cost: 3,
            description: "RESERVES arrive at this FORCE’s location instantly.***"
        },
        {
            name: "RANGED REFLEXES",
            hasAbility: false,
            abilityID: 21,
            cost: 3,
            description: "At the start of your turn, roll 3 HIT dice against any 1 enemy FORCE within 1 pencil distance."
        },
        {
            name: "SIGNAL",
            hasAbility: false,
            abilityID: 22,
            cost: 3,
            description: "If moving towards this FORCE, friendly FORCES gain the FAST ABILITY."
        },
        {
            name: "SNIPER",
            hasAbility: false,
            abilityID: 23,
            cost: 3,
            description: "Use ranged attacks at up to 4 pencils distance."
        },
        {
            name: "STEALTH",
            hasAbility: false,
            abilityID: 24,
            cost: 3,
            description: "Gain BLOCK or COVER benefits of TERRAIN even at up to 1 pencil distance from BLOCK or COVER features."
        },
        {
            name: "TAUNT",
            hasAbility: false,
            abilityID: 25,
            cost: 3,
            description: "Make an enemy FORCE attack this FORCE with its next turn."
        },
        ];
        this.isTurn = false;
        this.isDead = false;
        this.rollResults = [];
        this.freeRerolls = 10;
        this.types = [
            {
                name: "TROOP",
                isType: true,
                typeCost: 3,
                description: "REGULAR forces have 6 members, 1 ability, roll dice equal to current members, and lose 1 member per hit taken."
            },
            {
                name: "HERO",
                isType: false,
                typeCost: 6,
                description: "HEROIC forces have 1 member, 2 abilities, roll 3 dice, and take 3 hits to kill."
            },
            {
                name: "ELITE",
                isType: false,
                typeCost: 9,
                description: "ELITE forces have 1 member, 3 abilities, roll 6 dice, and take 6 hits to kill."
            },
        ];
        this.isCovered = false;
        this.reserveCount = 0;
        this.isSlowed = false;
        this.attackRange = 0;
        this.maxAbilities = 1;
        this.pastCost = 0;
        this.currentCost = 0;
        this.setupTesting();
    };

    getCurrentType() {
        let current;
        this.types.forEach(type => {
            if (type.isType) {
                current = type;
            }
        });
        return current;
    };

    calculatePoints() {
        console.log(`${players[playerId].name}'s current points are: ${players[playerId].currentPoints}.`)
 
        let condition = null;
        let checker;

        const tempType = this.types.filter(type => type.isType);
        const typePoints = tempType.map(type => type.typeCost).reduce((acc, cost) => acc + cost, 0);

        const tempAbility = this.abilities.filter(ability => ability.hasAbility);
        const abilityPoints = tempAbility.map(abil => abil.cost).reduce((acc, cost) => acc + cost, 0);

        this.currentCost = abilityPoints + typePoints;
        console.log("Current unit cost:", this.currentCost);
     
        if (this.pastCost < this.currentCost) {
            checker = players[playerId].currentPoints -= this.currentCost - this.pastCost;
        }
        if (this.pastCost > this.currentCost) {
            checker = players[playerId].currentPoints += this.pastCost - this.currentCost;
        }

        if (checker < 0) {
            //gtfo
            console.log("too much")
            condition = false;
            //return
        } else if (checker >= 0) {
            //stick around and calculate
            condition = true;
            //playerRef.currentPoints = checker;

            playerRef.update({
                currentPoints: checker,
            })

            this.pastCost = this.currentCost;
            console.log("Points were deducted. User's current point(s):", this.owner.currentPoints)
        }
        displayPoints(players[playerId].currentPoints);
        return condition; // give a bool to caller
    };

    setupTesting() {
        //this.ownerRef = playerRef;
        //this.unitDice = Math.floor(Math.random() * 6) + 1;
        //this.isTurn = Math.random() < 0.5 ? false : true;
        //this.isDead = Math.random() < 0.5 ? false : true;
        this.isCovered = Math.random() < 0.5 ? false : true;
        this.reserveCount = Math.floor(Math.random() * 4);
        this.isSlowed = Math.random() < 0.5 ? false : true;
        this.name = this.getCurrentType().name;
        //this.attackRange = 0; Math.random() < 0.5 ? "🏹" : "⚔️";
    }

    calcStats() {
        const type = this.types.filter(type => type.isType)[0];
        const matching = this.abilities.filter(ability => ability.hasAbility);

        if (type.name === "TROOP") {
            console.log(`Unit ${this.unitID} is of type: ${type.name}`)
            this.maxAbilities = 1;
            this.unitDice = 6;
        } else if (type.name === "HERO") {
            this.maxAbilities = 2;
            this.unitDice = 3;
        } else if (type.name === "ELITE") {
            this.maxAbilities = 3;
            this.unitDice = 6;
        } else { console.error("Could not calculate unit type.") }

        if (matching.length > 0) {
            let temp = matching.map(item => item.abilityID);

            // Ensure temp does not contain more than this.maxAbilities elements
            temp = temp.slice(0, this.maxAbilities);

            this.abilities.forEach(ability => {
                if (temp.includes(ability.abilityID)) {
                    ability.hasAbility = true;
                } else {
                    ability.hasAbility = false;
                }
            });
        }

        this.calculatePoints();
        populateAbilityUI(this);
        console.log(`Unit ${this.unitID} is of type: ${type.name}.`);
        console.log(`Unit ${this.unitID}'s max abilitiy count is now ${this.maxAbilities}.`);
        console.log(`Unit ${this.unitID}'s current ability list:`, this.abilities.filter(ability => ability.hasAbility))
    }

    getAbil() {
        // Filter abilities with hasAbility set to true
        const matching = this.abilities.filter(ability => ability.hasAbility);

        // Take the first three matching abilities
        const temp = matching.slice(0, 3);

        // const a = temp[0] ? temp[0].name : "";
        // const b = temp[1] ? temp[1].name : "";
        // const c = temp[2] ? temp[2].name : "";
        const a = temp[0] ? temp[0] : { name: "" };
        const b = temp[1] ? temp[0] : { name: "" };
        const c = temp[2] ? temp[0] : { name: "" };

        return [ a, b, c ]
    }

    rndDefaultImg() {
        this.imageSrc = defaultImages[Math.floor(Math.random() * defaultImages.length)];
    }

    createCard() {
        const section = document.createElement('section');
        section.className = 'card';
        section.id = `card-${this.unitID}`;
        const self = this;

        // Right click to edit
        section.oncontextmenu = function(event) {
            showEditForm(event, self);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        // Shift + Left click to delete
        section.addEventListener('click', function(event) {
            console.log("Left mouse clicked")
            if (event.shiftKey && event.button === 0 && players[playerId].canEdit) {
                console.log("Shift + Left mouse clicked")
                self.removeUnit.bind(self)(section);
            }
            
        });

        // Status Bar
        const statusBar = document.createElement('div');
        statusBar.className = 'status-bar';
        statusBar.innerHTML = `
            <p><ion-icon name="dice"></ion-icon><span id="unit-dice">${this.unitDice}</span></p>
            <p><ion-icon name="locate"></ion-icon><span id="unit-rng">${this.attackRange}</span></p>
            <p><ion-icon name="help-buoy"></ion-icon><span id="unit-reserves">${this.reserveCount}</span></p>
        `;
        section.appendChild(statusBar);

        // Image
        const image = document.createElement('img');
        image.className = 'card-img';
        image.src = this.imageSrc;
        image.alt = 'Unit Image';
        section.appendChild(image);

        // Title
        const title = document.createElement('h2');
        title.className = 'card-title';
        title.id = 'unit-title';
        title.textContent = this.name;
        section.appendChild(title);

        // Abilities
        const abilities = document.createElement('div');
        abilities.className = 'abilities';
        const aList = this.getAbil();
        abilities.innerHTML = `
            <p class="abil-txt" id="unit-abil1">${aList[0].name}</p>
            <p class="abil-txt" id="unit-abil2">${aList[1].name}</p>
            <p class="abil-txt" id="unit-abil3">${aList[2].name}</p>
        `;
        section.appendChild(abilities);

        // Side Bar
        const sideBar = document.createElement('div');
        sideBar.className = 'side-bar';
        sideBar.innerHTML = `
            <p id="unit-death">${this.isDead ? '☠️' : '💚'}</p>
            <p id="unit-cover">${this.isCovered ? '🛡️' : '👁️‍🗨️'}</p>
            <p id="unit-speed">${this.isSlowed ? '🐌' : '💨'}</p>
            <p id="unit-turn">${this.isTurn ? '💢' : '💤'}</p>
        `;
        section.appendChild(sideBar);

        // Footer
        const footer = document.createElement('p');
        footer.className = 'card-footer';
        footer.innerHTML = `<span id="unit-type">${this.getCurrentType().name}</span> id: <span id="unit-footer">${this.unitID}</span>`;
        section.appendChild(footer);

        return section;
    }

    removeUnit(section) {
        console.log("Attempting to remove unit with ID:", this.unitID);
        promptRemoveUnit(section, this);
    };
};

const cardContainer = document.getElementById('cardContainer');

function addUnit() {
    console.log("Attempting to create a unit");
    console.log("Available Points:", p1.currentPoints);

    if (p1.currentPoints >= 3) {
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

        showEditForm(null, unit, card)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    } else { 
        alert("Not enough point to create a unit. Points remaining: " + players[playerId].currentPoints)
        console.log("Unit creation failed");
        console.log("Points remaining:", players[playerId].currentPoints);
    } 
};

/////// Prob wont use this
function closeBoxes(evt) {
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

};
    
function populateAbilityUI(unit) {
    const fullAbilityList = document.getElementById("fullAbilityList");
    const currentAbilityDisplay = document.getElementById("currentAbilityDisplay");

    // Clear existing abilities in the UI
    fullAbilityList.innerHTML = '';
    currentAbilityDisplay.innerHTML = '';

    unit.abilities.forEach(ability => {
        const mainAbility = document.createElement('li');
        mainAbility.textContent = ability.name;

        mainAbility.onclick = () => clickAbility(ability, unit);
        mainAbility.addEventListener('contextmenu', event => promptRemoveAbility(event, ability, unit));
        //mainAbility.addEventListener('mouseover', event => showDescription(event, ability));

        fullAbilityList.appendChild(mainAbility);
        
        if (ability.hasAbility) {
            const displayedAbility = document.createElement('li');
            displayedAbility.textContent = ability.name;
            displayedAbility.onclick = () => clickAbility(ability, unit);
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

function clickAbility(ability, unit) {
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
                ability.unit.calculatePoints();
                populateAbilityUI(unit);
            } else { console.log("Dialog closed without removing ability.") }
            };
        });
    } // else do nothing
};

function getCenterScreen(elementId) {
    return ((window.innerHeight - document.getElementById(elementId).clientHeight) / 2) + "px";
}

function promptRemoveUnit(section, unit) {

        const popUp = document.getElementById("dialog__prompt-main");
        
        popUp.style.top = getCenterScreen(popUp.id);
        popUp.show();

        // Set dialog message
        document.getElementById("dialog__message-main").innerText = `Are you sure you want to remove "${unit.name}" Unit: ${unit.unitID}?`;

        // Create a promise and resolve it when the user confirms
        return new Promise(resolve => {
            // Define resolveDialog in the global scope
            window.resolveDialog = function(result) {
            // Hide overlay and custom dialog
            popUp.close();

            // Resolve the promise with the user's choice
            resolve(result);

            if (result) {
                // Determine cost of unit and refund to owner
                unit.calculatePoints();
                players[playerId].currentPoints += unit.currentCost;
                displayPoints(players[playerId].currentPoints);
                console.log(`${unit.currentCost} points were refunded to ${players[playerId].name}.`);

                // Remove unit from owner's list of units
                removeUnitFromDatabase(unit.unitID);

                //unit.owner.allUnits.splice(unit.owner.allUnits.indexOf(unit), 1);
                // above could still be good for offline

                // Fetch all units associated with the player
                getUnitsForUser(playerId)
                    .then((units) => {
                        console.log(`Units associated with player ${players[playerId].name}:`, units);
                        // Update your UI or perform any necessary actions with the fetched units
                    })
                    .catch((error) => {
                        // Handle error if necessary
                        console.error('Error retrieving units:', error);
                    });

                // Finally, remove visible card and set unit to null
                document.getElementById(section.id).remove();
                unit = null;
            } else { console.log("Dialog closed without removing unit.") }
            };
        });
};



function editPoints() {

    const popUp = document.getElementById("dialog__prompt-points");

    const popUpDetails = getElementDetails("points-display-box");

    const input = document.getElementById("point-modifier");

    if (popUpDetails) {
        // Set position and size styles for the dialog
        popUp.style.top = popUpDetails.top + "px";
        popUp.style.left = popUpDetails.left + "px";
        popUp.style.width = popUpDetails.width + "px";
        popUp.style.height = popUpDetails.height + "px";

        input.value = players[playerId].currentPoints;
        popUp.show();
    }
    // Create a promise and resolve it when the user confirms
    return new Promise(resolve => {
        // Define resolveDialog in the global scope
        window.resolveDialog = function(result) {
        
        popUp.close();

        // Resolve the promise with the user's choice
        resolve(result);

        if (result) {
            
            console.log(`User had ${players[playerId].currentPoints} point(s).`);

            playerRef.update({
                currentPoints: input.value,
            })
            console.log("User's points has been changed to:", players[playerId].currentPoints);
            document.getElementById("points-display").textContent = players[playerId].currentPoints;

            // input.value = 40;

        } else { console.log("Dialog closed without changing points.") }
        };
    });
};

function getElementDetails(elm) {
    const element = document.getElementById(elm);

    if (!element) {
        console.error(`Element with ID '${elm}' not found.`);
        return null;
    }

    const rect = element.getBoundingClientRect();

    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY,
    };
}

// document.addEventListener("DOMContentLoaded", () => {
//     populateAbilityUI()
// });



// document.querySelectorAll("form").forEach(form => {
//     form.addEventListener("submit", function(event) {
//       // Prevent the default form submission behavior
//       event.preventDefault();
//     });
// });


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
}

document.getElementById('cardContainer').appendChild(createAddCard());








})();



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
                    if (section.id === "roster" || section.id === "battle") {
                        section.style.display = "grid";
                    } else {
                        section.style.display = "flex";
                    }
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});


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
    console.log("Window loaded");

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
};

document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});