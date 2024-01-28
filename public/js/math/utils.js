function isSolid(x,y) {

    const blockedNextSpace = mapDataOld.blockedSpaces[getKeyString(x, y)];
    return (
        blockedNextSpace ||
        x >= mapDataOld.maxX ||
        x < mapDataOld.minX ||
        y >= mapDataOld.maxY ||
        y < mapDataOld.minY
    )
};

function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
};

function getKeyString(x, y) {
    return `${x}x${y}`;
};

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
};

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
        "DEER",
        "LYNX",
        "JAGUAR",
        "LION",
        "BOAR",
        "GOAT",
        "DRAGON",
        "COON",
        "PUMA",
        "RAT",
        "BULL",
        "RAVEN",
        "ELEPHANT",
        "RHINO",
        "EEL"
    ]);

    const num = Math.floor(Math.random() * 100) + 1;
    return `${prefix}-${animal}-${num}`;
};

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
    
function displayPoints(ref) { //TODO: ID should not be hard coded
    document.getElementById("playerMaxPointsDisplay").innerHTML = ref;
};

function getCenterScreen(elementId) {
    return ((window.innerHeight - document.getElementById(elementId).clientHeight) / 2) + "px";
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
};

const mapDataOld = {
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
}; // We need to move or delete this later


function getNearestPoint(loc, points, threshold = 20) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const point of points) {
        const dist = distance(point, loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = point;
        }
    }
    return nearest;
}

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function getRndID() {
    return Date.now() + (Math.random() * 100);
}; // old, replace with getHash

function getRnd8() {
    return Math.floor(Math.random() * 8 + 1);
};

function getRndItem(input) { // old, duplicate
    return input[Math.floor(Math.random() * input.length)];
}; // Great for picking a random element from an array.

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}; // Easy random int between two numbers. 

const compareObjs = (array1, array2, tier) => {
    const uniqueItems = array1.filter(item1 => !array2.some(item2 => item1.id === item2.id));
    const tempObjs = [];
    while (tempObjs.length < tier) {
      tempObjs.push(getRndItem(uniqueItems));
    };
    array2.push(...tempObjs);
  }; // Push objects without duplicates
  
function getFromArray(array) {
      const num = getRndInteger(0, array.length -1);
      return array[num].description;    
};
  
const battleMods = (arr, self, num) => {
    try {
        // Ensure valid int
        const idValue = parseInt(getRndInteger(1, 8));
    
        if (idValue >= 1 && idValue <= 8) {
        // Find object with matching id 
        const detail = arr.find(position => position.id === idValue);
    
        // Update description if found
        if (detail) {
            //self.name = detail.name; //works good but too much
            if (num === 1) {
                self.description1 = detail.description;
            };
            if (num === 2) {
                self.description2 = detail.description;
            };
            
            return detail.function;
            // Return the function associated
        } else {
            throw new Error("Id not found.");
        }
        } else {
        throw new Error("Invalid id value.");
        }
    } catch (error) {
        console.error("Error:", error.message);
        return null; // handle the error as needed
    }
};
  
const shuffleArray = array => {
    const indices = Array.from({ length: array.length }, (_, index) => index);
  
    indices.forEach((_, i) => {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    });
  
    return indices.map(index => array[index]);
};

const checkGridOld = () => {
    return gridArr[getRndInteger(0, 99)].getCenter();
} // REMOVE LATER IF NOT NEEDED

const checkGrid = (point, { side, color } = {}) => {
    // check the gridArr and get a random grid where ".forceInside" is empty or = []
    const emptyGrids = gridArr.filter(grid => grid.forceInside.length === 0);
    
    if (emptyGrids.length === 0) {
        console.error("No available grids");
        return null; // No available grid
    }

    const selectedGrid = getRndItem(emptyGrids);

    // find the grid's center cord using .getCenter()
    const center = selectedGrid.getCenter();

    // update the point details
    point.x = center.x;
    point.y = center.y;
    // point.side = side;
    // point.color = color;

    // push the point into the grid's forceInside array
    selectedGrid.forceInside.push(point);

    return center;
};

function getSqr(a, b) {
    return Math.sqrt(a ** 2 + b ** 2);
};
 
function limitMove(current, start, range) {
    const deltaX = current.x - start.x;
    const deltaY = current.y - start.y;

    const distance = getSqr(deltaX, deltaY);

    if (distance > range) {
        const angle = Math.atan2(deltaY, deltaX); // Math I dont understand
        return {
            x: start.x + range * Math.cos(angle),
            y: start.y + range * Math.sin(angle)
        };
    } else {
        return {
            x: current.x,
            y: current.y
        };
    }
};

// Not effienct but works for the overlay toggles
function findParentByClass(child, parentClass) {
    let currentElement = child;

    // Search through the DOM for a parent with the given class
    while (currentElement !== null && !currentElement.classList.contains(parentClass)) {
        currentElement = currentElement.parentNode;
    }

    // Check if we found an element with the matching class
    if (currentElement !== null && currentElement.classList.contains(parentClass)) {
        //console.log("Found parent with matching class:", currentElement);
        return currentElement;
    } else {
        console.error("No parent with matching class found.");
        return null;
    }
};