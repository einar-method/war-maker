class GraphEditor2 {
    constructor(canvas, graph) {
        this.canvas = canvas;
        this.graph = graph;

        this.shootRange = 200;

        // added for testing new placement drag
        this.dragStart = null;

        this.ctx = this.canvas.getContext("2d");

        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        this.canHover = true;

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
        this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
        //this.canvas.addEventListener("mouseup", () => this.dragging = false);
    }

    #handleMouseDown(evt) {
        /* if (evt.button == 2) { // right mouse click
            if (this.selected) {
                this.selected = null;
            } else if (this.hovered) {
                this.#removePoint(this.hovered);
            }
        } */ // we need this for battle setup, not play
        if (evt.button == 0) { // left mouse click

            // TODO: We also need to handle turn order and move actions first


            // if (this.selected.owner === playerId || this.hovered.owner === playerId) {
            //     console.error("YES, this is your point!")
            // } else { console.error("NO, this is not your point!")}
            

            if (this.selected) {
                //console.log(this.selected)

                if (this.selected.owner === this.graph.ownerId) {
                    console.log("YES, this is your point!")

                    this.dragging = false;
                    this.selected = null;
                    this.hovered = null;
                    //this.#removePoint(this.dragStart);
                    this.dragStart = null;

                    this.canHover = true;

                    // is this the right place for the reurn now?
                    return;
                } else { 
                    // TODO: Could we handle enemy targetting here?
                    console.log("NO, this is not your point!") 
                }
            };

            if (this.hovered) {

                if (this.hovered.owner === this.graph.ownerId) {
                    console.log("YES, this is your point!")

                    this.#select(this.hovered);
                    this.dragging = true;
                    
                    this.dragStart = new Point2(this.selected.x, this.selected.y);
                    
                    return;
                } else { console.log("NO, this is not your point!")}
            };

            // this needs to update a point not add one
            // Or add a network point!
            //this.graph.addPoint(this.mouse);
            // console.log("MOUSE before add point", this.mouse)
            // console.log("X before add point", this.mouse.x)
            // console.log("Y before add point", this.mouse.y)
            beginPointCreation(this.mouse)

        }
    }

    #handleMouseMove(evt) {
        this.mouse = new Point2(evt.offsetX, evt.offsetY);

        if (this.canHover) {
            this.hovered = getNearestPoint(this.mouse, this.graph.points, GRID_SIZE);
        } // We dont want to hover if we are moving a point
        
        
        if (this.dragging && this.selected) {
            this.canHover = false;
            /* const deltaX = this.mouse.x - this.dragStart.x;
            const deltaY = this.mouse.y - this.dragStart.y;
            //const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
            const distance = getSqr(deltaX, deltaY);

            // Limit the movement to the shootRange
            if (distance > this.shootRange) {
                const angle = Math.atan2(deltaY, deltaX); // Math I dont understand
                this.mouse.x = this.dragStart.x + this.shootRange * Math.cos(angle);
                this.mouse.y = this.dragStart.y + this.shootRange * Math.sin(angle);
            } */

            // Return mouse if within move range, else return max range
            this.mouse = limitMove(this.mouse, this.dragStart, this.shootRange)

            // Update the selected point
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;

            // Update to server?
            graph.updatePointOnServer();
        }
    };

    #select(point) {
        // if (this.selected) {
        //     this.graph.tryAddSegment(new Segment(this.selected, point));
        // }
        this.selected = point;
    }

    #removePoint(point) {
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected == point) {
            this.selected = null;
        }
    }

    display() {
        //graph.updatePointOnServer();
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }
        if (this.selected) {
            //outline
            this.selected.draw(this.ctx, { outline: true });
        
            
            const intent = this.hovered ? this.hovered : this.mouse;

        if (this.dragStart) {
            this.dragStart.draw(this.ctx, { outline: true, color: "gray" });
        }
        // Create a new extended segment
        //console.log(intent)
        const extendedSegment = new Segment2(this.dragStart, intent);

        // Draw the extended segment with a dashed line
        extendedSegment.draw(this.ctx, { dash: [3, 3], range: this.shootRange });


        // const limitedExtendedSegment = extendedSegment.extendToDistance(Math.min(this.shootRange, extendedSegment.length()));

        // // Draw the limited extended segment with a dashed line
        // limitedExtendedSegment.draw(this.ctx, { dash: [3, 3], range: this.shootRange });





        this.ctx.setLineDash([3, 3]); // Set the line dash style
        this.ctx.strokeStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(this.selected.x, this.selected.y, 50, 0, 2 * Math.PI); // Adjust radius as needed
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset the line dash style

        }
    };
};