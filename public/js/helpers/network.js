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
  const lobbyId = lobbyCode;

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

  sendMessage("Your sharable war code is: " + lobbyCode);
  document.getElementById("createLobbyStatus").innerHTML = `Your sharable war code is: <span style="font-weight: bold;">${lobbyCode}</span>`;
};

 // Join a lobby using an invite code
 function joinLobby(lobbyId) {
  console.log("Lobby code:", lobbyId)
  console.log("Joining player ID:", playerId)
  // Get a reference to the messageGroups node in the database
  const messageGroupsRef = firebase.database().ref('messageGroups');

  // Check if the lobbyId exists
  messageGroupsRef.child(lobbyId).once('value')
  .then((snapshot) => {
      const groupData = snapshot.val();

      // Check if the lobbyId is valid
      if (groupData) {
      // Check if the current user is already a member of the group
      //TODO: this checker has stopped working! 
      if (groupData.members && groupData.members.includes(playerId)) {
			console.log(playerId + " was already a member of lobby: " + lobbyId);
			alert("You are already a member of this war.");
			document.getElementById("joinLobbyStatus").innerHTML = "You are already a member of this war.";
      } else {
			// Add the current user to the group members
			const updatedMembers = (groupData.members || []).concat(playerId);
			
			// Update the database with the new members list
			messageGroupsRef.child(lobbyId).child('members').set(updatedMembers);

			playerRef.update({
				currentLobby: lobbyId,
			});

			console.log("Successfully joined lobby: " + lobbyId);
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