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

  sendMessage("Your sharable war code is: " + groupName);
};

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
      //TODO: this checker has stopped working!
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