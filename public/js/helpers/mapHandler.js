function updatePoints(point) {
    const lobbyCanvas = document.getElementById("myCanvas");
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
        const userLobbyRef = firebase.database().ref(`players/${currentUser.uid}`);

        userLobbyRef.once('value')
            .then((snapshot) => {
                const userLobbyData = snapshot.val();

                if (userLobbyData && userLobbyData.currentLobby) {
                    const currentGroupId = userLobbyData.currentLobby;

                    const pointData = {
                        userId: currentUser.uid,
                        x: point.x,
                        y: point.y,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                    };

                    // Push the message under the currentGroupId
                    const pointRef = firebase.database().ref(`lobbies/${currentGroupId}/mapData`);
                    
                    // Detach previous event listener to avoid receiving messages twice
                    pointRef.off('child_added');

                    pointRef.push(pointData);  

                    // Add a new event listener to handle the child_added event
                    pointRef.limitToLast(1).on('child_added', (snapshot) => {
                        const point = snapshot.val();

                        // Display the most recent point in the chat feed
                        if (point) {
                            const pointElement = document.createElement('p');

                            const senderId = point.userId;
                            const senderRef = firebase.database().ref(`players/${senderId}`);
                            
                            senderRef.once('value', (senderSnapshot) => {
                                const senderData = senderSnapshot.val();
                        
                                if (senderData && senderData.name) {
                                    // Display the sender's name along with the most recent point text
                                    pointElement.textContent = `${senderData.name}: ${point.text}`;
                                    lobbyCanvas.appendChild(pointElement);
                                    console.log(`User ${senderData.name} updated the point:`, point);
                                    //lobbyCanvas.scrollTo(0, lobbyCanvas.scrollHeight);
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