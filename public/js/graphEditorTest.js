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

            if (this.selected) {
                console.log(this.selected)
                this.dragging = false;
                this.selected = null;
                this.hovered = null;
                //this.#removePoint(this.dragStart);
                this.dragStart = null;

                this.canHover = true;
                return;
            };

            if (this.hovered) {
                this.#select(this.hovered);
                this.dragging = true;
                
                this.dragStart = new Point2(this.selected.x, this.selected.y);
                return;
            };

            this.graph.addPoint(this.mouse);
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
        }
    };

    #select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
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
        console.log(intent)
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