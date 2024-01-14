
console.log("Archive here?")

/* function getCardID(input) {
    // Retrieve the unitID from the clicked DOM element
    const clickedUnitID = input;

    // Use the find method to find the object with a matching unitID
    const matchingUnit = allUnits.find(unit => unit.unitID == clickedUnitID);

    if (matchingUnit) {
        return matchingUnit;
    } else {
        console.log("No matching unit found");
    }
}; // probably not needed now that we pass the unit with edit */

// Testing variables
class Player {
    constructor() {
        this.currentPoints = 40;
        this.allUnits = [];
        this.name = "Scotty";
        this.canEdit = true;
    }
}

//const p1 = new Player();

/* /////// Prob wont use this
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

}; */