function getTargetting(self, target, selfUnit, targetUnit,) {
    for (let i = 0; i < pointsArr.length; i++) {
        pointsArr[i].isTurn = false;
        pointsArr[i].isTarget = false;
    } // first clear all selected and targets
    
    /* 
    We need a system to handle targetting for 
    distance, abilities, and attacks. Then
    determine action economy and direct us to other functions
    like combat() or takeTurns etc.
    */

    //console.log("selected unit cord:", selfUnit.cord)
    //console.log("Targetted unit cord:", targetUnit.cord)

    for (let i = 0; i < pointsArr.length; i++) {
        //console.log(pointsArr[i].equals(selfUnit.cord))
        if (pointsArr[i].equals(selfUnit.cord)) {
            //console.log("point:", pointsArr[i].x, pointsArr[i].y)
            pointsArr[i].isTurn = true;
        }
        if (pointsArr[i].equals(targetUnit.cord)) {
            //console.log("point:", pointsArr[i].x, pointsArr[i].y)
            pointsArr[i].isTarget = true;
        }
    }
  
    // check BANNER ability on selfUnit
    if (selfUnit.checkAbility(5)) {
      console.log("This unit can target enemy with BANNER")
      let willTarget = true; //should start false
      
      //await user or AI choice
  
      /* //FOR TESTING PURPUSES to simulate the above
      let tempNum = getRndInteger(1, 2);
      if (tempNum === 1) {
        willTarget = true;
      }; */
  
      // If unit will target foe, apply BANNER mark
      if (willTarget = true) {
          targetUnit.isBannerTarget = true;
          console.log("A BANNER has targetted unit", targetUnit.unitID)
        }
    };
}; 

function targertingAI(p1, p2) {
  // consider who goes first
  // select a random owned unit to take the turn
  // select a random foe as target
  // check range and contact
  // check line of sight and cover
  let attacker;
  let defender;
  let attackingUnit;
  let defendingUnit;

  if (p2.isTurn === true) {
    console.log("p2 is first, p1 goes last")
    attacker = p2;
    defender = p1;
    attackingUnit = getRndItem(p2.battleForces);
    defendingUnit = getRndItem(p1.battleForces);
    // note this is for random units
    // will need dif code for selecting specific units
  } else if (p1.isTurn === true) {
    console.log("p1 is first, p2 goes last")
    attacker = p1;
    defender = p2;
    attackingUnit = getRndItem(p1.battleForces);
    defendingUnit = getRndItem(p2.battleForces);
  } else { console.log("error") }


  console.log("new p1 unit:", attackingUnit)
  console.log("new p2 unit:", defendingUnit)

  combat(attacker, defender, attackingUnit, defendingUnit);

};