function getFoe(war, self) {
    return war.commanders.indexOf(self) > 0 ? 0 : 1;
  };
  
function removeDead(tempArray, orgArray, obj) { //maybe put in commander
    tempArray.forEach(battleUnit => {
      const matchIndex = orgArray.findIndex(allUnit => allUnit.unitID === battleUnit.unitID);
  
      if (matchIndex !== -1 && battleUnit.isDead == true) { // added true without testing
        orgArray[matchIndex].isDead = true;
        console.log(obj.name + "'s " + battleUnit.description + " unit (" + battleUnit.unitID + ") has died.");
        obj.battleLosses++;

        for (let i = 0; i < pointsArr.length; i++) {
            if (pointsArr[i].equals(orgArray[matchIndex].cord)) {
                pointsArr[i].isDead = true;
                graph.removePoint(pointsArr[i])
            }
        }

      }
    });
    obj.battleForces = tempArray.filter(battleUnit => !battleUnit.isDead);
    
};

function stepCombat() {
    takeTurn();
}

function setupWar() {
    currentWar = new War();
    console.log(currentWar);
    
    const scotty = currentWar.commanders[0].name + " starts with " + currentWar.commanders[0].allForces.length + " total forces."
    console.log(scotty)

    const hank = currentWar.commanders[1].name + " starts with " + currentWar.commanders[1].allForces.length + " total forces."
    console.log(hank)
    return { p1: scotty, p2: hank }; 
}

function startBattle() {
    const bat = currentWar.getCurrentBattle();
    if (!bat.check) {
    return false
    } else {

        currentWar.currentBattle.isActive = true;

        const txt = "The " + bat.txt + " has begun!";

        const scotty = currentWar.commanders[0].name + " starts with " + currentWar.commanders[0].battleForces.length + " forces in this battle."
        console.log(scotty)

        const hank = currentWar.commanders[1].name + " starts with " + currentWar.commanders[1].battleForces.length + " forces in this battle."
        console.log(hank)
        return { bat: bat.turns, p1: scotty, p2: hank, txt: txt };
    }
};

function simulateCombat() {
    if (!currentWar.getCurrentBattle()) {
      return false
    } else {
  
    console.log(currentWar)
  
    console.log(currentWar.commanders[0].name + " starts with " + currentWar.commanders[0].allForces.length + " total forces and " + currentWar.commanders[0].battleForces.length + " forces in this battle.")
    console.log(currentWar.commanders[1].name + " starts with " + currentWar.commanders[1].allForces.length + " total forces and " + currentWar.commanders[1].battleForces.length + " forces in this battle.")
    currentWar.currentBattle.isActive = true;
    const p1 = currentWar.commanders[0];
    const p2 = currentWar.commanders[1];
    const largest = Math.max(p1.battleForces.length, p2.battleForces.length);
  
    // p1.tempForces = p1.battleForces;
    // p2.tempForces = p2.battleForces;
  
    let num = 0;
    while (currentWar.currentBattle.isActive == true) {
      num++;
      takeTurn()
      if (num >= largest * 100) { // just stop after too many 
        currentWar.currentBattle.isActive = false;
        console.log("All must be dead or tired right?")
        //concludeBattle();
        break;
      }
    };
    concludeBattle();
  
    if (currentWar.stageNum < 4) {
      simulateCombat();
    } else {
      console.log("The war has concluded or is in final front")
      concludeWar();
    }
  }
  return true;
  
};

function combat(a, d, attacker, defender) {
    a.currentHits = 0;
    // next we work on automating all unitis in battleArray
    attacker.rollAttacks(defender);
    a.currentHits = attacker.evaluateAttacks();
  
    let tempHits = defender.hitsTaken;
  
    defender.hitsTaken = a.currentHits; //may need += in future
    defender.calcDamage();
    console.log(a.name + "'s " + attacker.description + " unit (" + attacker.unitID + ") applied " + a.currentHits + " hit(s) to " + d.name + "'s " + defender.description +  " unit (" + defender.unitID + "). The unit had " + tempHits + " previous hit(s) and has taken " + defender.hitsTaken + " current hit(s) with " + defender.diceCount + " hit(s) remaining. The unit isDead: " + defender.isDead);
    //d.calcLosses();
    removeDead(d.battleForces, d.allForces, d);
    // removeDead(d.battleForces, d.allForces, d);
};
  
function takeTurn() {
    if (currentWar.currentBattle.isActive == true) {
        //   //console.log("The war continues!");
        // } else { 
        //   console.log("The war seems to be over.")
        //   return console.log("WTF is actually happening"); 
        // }
        const p1 = currentWar.commanders[0];
        const p2 = currentWar.commanders[1];
        let activePlayer;
        let defendingPlayer;
        let attackingUnit;
        let defendingUnit;
  
        // Check, has either player taken a turn?
        // If not, use initiative order (lower is better)
        if (p1.isTurn == null && p2.isTurn == null) {
            if (p1.turnOrder > p2.turnOrder) {
            p2.isTurn = true;
            p1.isTurn = false;
            activePlayer = p2;
            defendingPlayer = p1;
            } else if (p2.turnOrder > p1.turnOrder) {
            p1.isTurn = true;
            p2.isTurn = false;
            activePlayer = p1;
            defendingPlayer = p2;
            } else { console.log("error getting turn order") }
        } else { // If not null, select the next player
            if (p1.isTurn == true) {
            p2.isTurn = true;
            p1.isTurn = false;
            activePlayer = p2;
            defendingPlayer = p1;
            } else if (p2.isTurn == true) {
            p1.isTurn = true;
            p2.isTurn = false;
            activePlayer = p1;
            defendingPlayer = p2;
            } else { console.log("Error switching turns") }
        }
  
        console.log(activePlayer.name + "'s turn");
    
        if (activePlayer.battleForces.length > 0 && defendingPlayer.battleForces.length > 0) {
            defendingUnit = getRndItem(defendingPlayer.battleForces);
            attackingUnit = getRndItem(activePlayer.battleForces);

            getTargetting(activePlayer, defendingPlayer, attackingUnit, defendingUnit)
            combat(activePlayer, defendingPlayer, attackingUnit, defendingUnit);
            console.log("Attacker's final rolls:", attackingUnit.rollResults);
            console.log("Attacker's hits:", activePlayer.currentHits);
    
        } else {
            currentWar.currentBattle.isActive = false;
            if (activePlayer.battleForces <= 0) {
            console.log("All of " + activePlayer.name + "'s battle forces are dead. The " + currentWar.currentBattle.name + " battle is active =", currentWar.currentBattle.isActive)
            }
            if (defendingPlayer.battleForces <= 0) {
            console.log("All of " + defendingPlayer.name + "'s battle forces are dead. The " + currentWar.currentBattle.name + " battle is active =", currentWar.currentBattle.isActive)
            }
        };
    } else { console.log("This battle seems to be over.") }
}; 
  
function concludeBattle() {
    currentWar.currentBattle.isActive = false;
    const p1 = currentWar.commanders[0];
    const p2 = currentWar.commanders[1];
  
    let p1Remaining = p1.allForces.length - p1.calcLosses();
    console.log("P1 remaining", p1Remaining)
    let p2Remaining = p2.allForces.length - p2.calcLosses();
    console.log("P2 remaining", p2Remaining)
  
    console.log("P1 total dead", p1.totalLosses)
    console.log("P2 total dead", p2.totalLosses)
    console.log("P1 battle dead", p1.battleLosses)
    console.log("P2 battle dead", p2.battleLosses)
  
    if (p1.battleLosses == p2.battleLosses) {
      console.log("The " + currentWar.currentBattle.name + " battle was a tie!");
    } else if (p1.battleLosses < p2.battleLosses) {
      console.log(p1.name + " wins the " + currentWar.currentBattle.name + " battle.");
    } else if (p1.battleLosses > p2.battleLosses) {
      console.log(p2.name + " wins the " + currentWar.currentBattle.name + " battle.");
    } else { console.log("Error determing winner") };
  
    console.log(p1.name + " ends battle with " + p1.battleLosses + " forces lost and " + p1Remaining + " total forces remaining in the war.")
    console.log(p2.name + " ends battle with " + p2.battleLosses + " forces lost and " + p2Remaining + " total forces remaining in the war.")
  
    //console.log(p1);
    //console.log(p2);
    p1.battleLosses = 0;
    p2.battleLosses = 0;
    p1.allForces.forEach(obj => {
      obj.calcNumbers();
    });
    p2.allForces.forEach(obj => {
      obj.calcNumbers();
    });

    pointsArr = []; // prob needs to be part of the war obj
};

function concludeWar() {
  console.log(currentWar.commanders[0].allForces.filter(battleUnit => !battleUnit.isDead))
  console.log(currentWar.commanders[1].allForces.filter(battleUnit => !battleUnit.isDead))
};