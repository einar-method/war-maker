class Graph2 {
    constructor(points = [], segments = [], staging = []) {
        this.points = points;
        this.segments = segments;
        this.stagingAreas = staging;
        this.owner = this.getOwner();
        this.ownerId = 0;
    }

    getOwner() { // We use a setInterval because the user is not authenticated when graph first runs
        // TODO: set up the entire graph only after user auth!
        const graphInterval = setInterval(() => {
            const currentUser = firebase.auth().currentUser;

            if (currentUser) {
                const userRef = firebase.database().ref(`players/${currentUser.uid}`);
                userRef.once('value')
                .then((snapshot) => {

                    const mirror = snapshot.val();

                    clearInterval(graphInterval);
                    this.ownerId = mirror.id;
                })
                .catch((error) => {
                    console.error('Error getting user ID:', error);
                });

            } else {
                console.error('Unable to set graph owner: No authenticated user. Retrying in 3 seconds...');
            }
        }, 3000);
    }

    computeColor(pointId) {
        if (pointId === this.ownerId) {
            return "green"
        } else { return "red" }
    }

    addPoint(point) {
        this.points.push(point);
    }

    containsPoint(point) {
        return this.points.find((p) => p.equals(point));
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false; 
    }

    removePoint(point) {
        const segs = this.getSegmentsWithPoint(point);
        for (const seg of segs) {
            this.removeSegment(seg);
        }
        this.points.splice(this.points.indexOf(point), 1);
    }

    addSegment(seg) {
        this.segments.push(seg);
    }

    containsSegment(seg) {
        return this.segments.find((s) => s.equals(seg));
    }

    tryAddSegment(seg) {
        if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
            this.addSegment(seg);
            return true;
        }
        return false;
    }

    removeSegment(seg) {
        this.segments.splice(this.segments.indexOf(seg), 1);
    }

    getSegmentsWithPoint(point) {
        const segs = [];
        for (const seg of this.segments) {
            if (seg.includes(point)) {
                segs.push(seg);
            }
        }
        return segs;
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    draw(ctx) {
        for (const seg of this.segments) {
            if (seg.p1.equals(seg) || seg.p2.equals(seg)) {
                seg.draw(ctx);
            }
        }

        for (const point of this.points) {
            point.draw(ctx);
        }

        for (const stage of this.stagingAreas) {
            stage.draw(ctx);
        }
    };

    getMapDataFromServer() {
        //console.log("Graph ID:", this.ownerId)
        for (const point of this.points) {
            //point.draw(ctx);
            // if (point.timestamp = )
            Object.keys(mapData).forEach((key) => {
                if (point.key == key) {
                    //console.log("We had a match!")
                    //pointKey = key;
                    // add if (point.x != mapData[key].x)
                    point.x = mapData[key].x;
                    point.y = mapData[key].y;
                    point.color = this.computeColor(mapData[key].owner);
                    
                    // I think the below is a good way to fix the color issue too?
                    // The point select owner check does not work without this.
                    // TODO: Why is the above statement true?
                    point.owner = mapData[key].owner;
                } // else { console.log("No match") }
            })
        }
    };

    updatePointOnServer() {
        let pointKey;
        let xInput;
        let yInput;

        for (const point of this.points) {
            //point.draw(ctx);
            // if (point.timestamp = )
            Object.keys(mapData).forEach((key) => {
                //console.log("Client stamp:", point.key)
                //console.log("Server stamp:", key)
                if (point.key == key) {
                    //console.error("We had a match!")
                    //pointKey = key;
                    xInput = point.x;
                    yInput = point.y;

                    const pointRef = lobbyRef.child('mapData').child(key);
    
                    // Update the server-side data
                    pointRef.update({
                        x: point.x,
                        y: point.y,
                        //key: pointKey,
                    })
                    .then(() => {
                        // console.log(`Point updated on the server successfully`);
                    })
                    .catch(error => {
                        console.error(`Error updating the point on the server:`, error);
                    });
                } // else { console.log("No match") }
            })
        }

        // if (pointKey) {
        //     console.log("we have a key")
        //     // const pointRef = lobbyRef.child('mapData').child(pointKey);
    
        //     // // Update the server-side data
        //     // pointRef.update({
        //     //     x: xInput,
        //     //     y: yInput,
        //     //     key: pointKey,
        //     // })
        //     // .then(() => {
        //     //     console.log(`Point updated on the server successfully`);
        //     // })
        //     // .catch(error => {
        //     //     console.error(`Error updating the point on the server:`, error);
        //     // });
        // } else { console.log("No keys to work with") }
        
    };

}