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
                                    chatFeed.scrollTo(0, chatFeed.scrollHeight);
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