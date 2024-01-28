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
};

// Function to create a new message group
function createLobby(lobbyCode) {
	// Generate a random string for the lobby ID
	lobbyId = lobbyCode;

	// Get the current user's ID
	const userId = firebase.auth().currentUser.uid;

	// Reference to the lobby in the Realtime Database
	lobbyRef = firebase.database().ref(`lobbies/${lobbyId}`);

	// Set up onDisconnect for the lobby
	lobbyRef.onDisconnect().remove();

	// Check if the lobby already exists (to avoid collisions)
	lobbyRef.once('value', (snapshot) => {

		if (!snapshot.exists()) {
			// The group does not exist, create it
			console.error("Lobby snapshot no exist")
			lobbyRef.set({
				members: [userId],
				createdAt: firebase.database.ServerValue.TIMESTAMP
			});
		} else { 
			//console.log("SNAPSHOT:",snapshot) 
			lobbyRef.set({
				members: [userId],
				createdAt: firebase.database.ServerValue.TIMESTAMP
			});
		}
	});

	playerRef.update({
		currentLobby: lobbyId,
	});

	sendMessage("Your sharable war code is: " + lobbyId);
	document.getElementById("createLobbyStatus").innerHTML = `Your sharable war code is: <span style="font-weight: bold;">${lobbyId}</span>`;

	setMapOperations(lobbyId);
	
};

 // Join a lobby using an invite code
 function joinLobby(code) {
	console.log("Lobby code:", code)
	console.log("Joining player ID:", playerId)
	// Get a reference to the lobbies node in the database
	//lobbyRef = firebase.database().ref('lobbies');
	lobbyRef = firebase.database().ref(`lobbies/${code}`);

	// Check if the lobbyId exists
	lobbyRef.once('value')
		.then((snapshot) => {
			const groupData = snapshot.val();

			// Check if the code is valid
			if (groupData) {
				// Check if the current user is already a member of the group
				//TODO: this checker has stopped working! 
				if (groupData.members && groupData.members.includes(playerId)) {
					console.log(playerId + " was already a member of lobby: " + code);
					alert("You are already a member of this war.");
					document.getElementById("joinLobbyStatus").innerHTML = "You are already a member of this war.";
				} else {
					// Add the current user to the group members
					const updatedMembers = (groupData.members || []).concat(playerId);
					
					// Update the database with the new members list
					lobbyRef.child(code).child('members').set(updatedMembers);

					playerRef.update({
						currentLobby: code,
					});

					// Set the client's lobbyId and map ref
					lobbyId = code;
					const map = firebase.database().ref(`lobbies/${code}/mapData`);
					map.once('value', (snapshot) => {
						mapData = snapshot.val() || {};
					})
					graph.getMapDataFromServer()
					
					setMapOperations(code);
					//graph.getMapDataFromServer();
					ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
					graph.draw(ctx);
			
					console.log("Successfully joined lobby: " + code);
					sendMessage("Has joined the war!");
					document.getElementById("joinLobbyStatus").innerHTML = `You have joined a war loby with code: <span style="font-weight: bold;">${lobbyId}</span>`;
				}
			} else {
				alert("Invalid war code. Please check and try again.");
				document.getElementById("joinLobbyStatus").innerHTML = "Invalid war code. Please check and try again.";
			}
		})
		.catch((error) => {
			console.error('Error joining lobby:', error);
		});
};

function setMapOperations(input) {
	allMapDataRef = firebase.database().ref(`lobbies/${input}/mapData`);

	allMapDataRef.on("value", (snapshot) => {
		//console.error("CHANGING by:", playerId)
		//graph.points = [];
        //Fires whenever a change occurs
        mapData = snapshot.val() || {};
		//console.log(mapData)
		graph.getMapDataFromServer();
		//ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
		//graph.draw(ctx);

        //Object.keys(mapData).forEach((key) => {
            //console.log(mapData[key]) //NOTE: checks if map is being passed correctly
            //console.log(unitElements[mapData[key].unitID]) //NOTE: unit is being passed correctly

			// Do work here
			
			//const modPoint = mapData[key];
			//console.log(modPoint)
			//graph.points = Object.values(mapData)
			// graph.getMapDataFromServer();
			// ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
			// graph.draw(ctx);
			// const addedPoint = snapshot.val();
			// const prim = new Point2(addedPoint.x, addedPoint.y)
        
            // const success = graph.tryAddPoint(prim);
            // ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
            // graph.draw(ctx);
            // console.log("Could find a point?", success);

            // if (mapData[key].owner === playerId) {
			// 	console.log("This was my data", mapData[key]);
            //     // setTimeout(() => {
            //     //     console.log(mapData[key]);
            //     // }, 100); 
            // } else { console.log("this was not my update", mapData[key]) }
        //})
    });

    allMapDataRef.on("child_added", (snapshot) => {
        //Fires whenever a new point is added to map
        console.log(playerId + " added a point.")

		const addedPoint = snapshot.val();

		console.log(snapshot.key)

		const prim = new Point2(addedPoint.x, addedPoint.y)
        prim.key = snapshot.key;
		prim.owner = playerId;

		const success = graph.tryAddPoint(prim);
		ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
		graph.draw(ctx);
		console.log("Could find a point?", success);

        


        // if (addedPoint.owner === playerId) {
        //     console.log("I own this!")

        //     // const prim = new Point2(addedPoint.x, addedPoint.y)
        
        //     // const success = graph.tryAddPoint(prim);
        //     // ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        //     // graph.draw(ctx);
        //     // console.log("Could find a point?", success);
        //     // const forceElm = createForceCard(addedPoint);
        //     // cardContainer.insertBefore(forceElm, cardContainer.lastElementChild); 
        //     //mapData[addedPoint] = forceElm;

        // } else { console.log("I DONT own this!") }
    });
}