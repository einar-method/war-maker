class ForceOld {
    constructor(faction, num, { x = 0, y = 0} = {}, { side = null, color = null } = {}) {
        this.unitID = getRndID();
        this.cord = { x, y };
        this.name; //flair, not needed yet
        this.description; //tied to name
        this.commander = faction;
        this.enemy = this.commander.enemy;
        this.side = side;
        this.color = color;
        this.unitTier = num; //more functionality later
        this.unitCount //more later
        this.diceCount
        this.abilities = [
        {
            name: "AGILE",
            hasAbility: false,
            abilityID: 1,
            description: "Ignore ROUGH terrain."
        },
        {
            name: "ARTILLERY",
            hasAbility: false,
            abilityID: 2,
            description: "When HITS are rolled on a ranged attack, divide them in any array between targets in range."
        },
        {
            name: "ARMOR",
            hasAbility: false,
            abilityID: 3,
            description: "Re-roll HITS against this FORCE."
        },
        {
            name: "BUILDERS",
            hasAbility: false,
            abilityID: 4,
            description: "This FORCE can spend its turn to create a piece of BLOCK terrain. The new terrain is placed in contact with the BUILDERS."
        },
        {
            name: "BANNER",
            hasAbility: false,
            abilityID: 5,
            description: "Allies attacking this FORCE’s target re-roll MISSES."
        },
        {
            name: "BERZERK",
            hasAbility: false,
            abilityID: 6,
            description: "When using CHARGE, re-roll MISSES."
        },
        {
            name: "BOLSTER",
            hasAbility: false,
            abilityID: 7,
            description: "Use a turn to store 1 die. Give this die to any allied FORCE, use on any future roll."
        },
        {
            name: "DEMOLISH",
            hasAbility: false,
            abilityID: 8,
            description: "If in range of a terrain feature, roll 3 HITS to destroy that feature completely, removing it from battle."
        },
        {
            name: "DEFLECT",
            hasAbility: false,
            abilityID: 9,
            description: "Use a turn to store 1 die. Expend this die to absorb 1 single attack in the future, no matter its number of HITS."
        },
        {
            name: "EVASIVE",
            hasAbility: false,
            abilityID: 10,
            description: "Ranged attacks cannot hit this FORCE."
        },
        {
            name: "FAST",
            hasAbility: false,
            abilityID: 11,
            description: "Add a pencil to any movement rule when moving this FORCE."
        },
        {
            name: "FLIGHT",
            hasAbility: false,
            abilityID: 12,
            description: "This monster can leap or fly. It always DASHES, even when in a CHARGE, and goes over any terrain in its path."
        },
        {
            name: "FURY",
            hasAbility: false,
            abilityID: 13,
            description: "If this FORCE makes at least 1 HIT with an attack, it can attack again."
        },
        {
            name: "HEAT VISION",
            hasAbility: false,
            abilityID: 14,
            description: "Ignore the effect of COVER on your targets."
        },
        {
            name: "INTERVENTION",
            hasAbility: false,
            abilityID: 15,
            description: "If an ally within 1 pencil is attacked, move there instantly and take the attack. Use only before HIT dice are rolled."
        },
        {
            name: "MARKSMAN",
            hasAbility: false,
            abilityID: 16,
            description: "Re-roll MISSES on all ranged attacks."
        },
        {
            name: "MASSIVE",
            hasAbility: false,
            abilityID: 17,
            description: "This FORCE functions as BLOCK terrain. ***"
        },
        {
            name: "MELEE REFLEXES",
            hasAbility: false,
            abilityID: 18,
            description: "At the start of your turn, roll 3 HIT dice against any 1 enemy FORCE currently in contact."
        },
        {
            name: "POWER UP",
            hasAbility: false,
            abilityID: 19,
            description: "Use a turn to store 1 die. Use that die on any roll in future turns.***"
        },
        {
            name: "RALLY POINT",
            hasAbility: false,
            abilityID: 20,
            description: "RESERVES arrive at this FORCE’s location instantly.***"
        },
        {
            name: "RANGED REFLEXES",
            hasAbility: false,
            abilityID: 21,
            description: "At the start of your turn, roll 3 HIT dice against any 1 enemy FORCE within 1 pencil distance."
        },
        {
            name: "SIGNAL",
            hasAbility: false,
            abilityID: 22,
            description: "If moving towards this FORCE, friendly FORCES gain the FAST ABILITY."
        },
        {
            name: "SNIPER",
            hasAbility: false,
            abilityID: 23,
            description: "Use ranged attacks at up to 4 pencils distance."
        },
        {
            name: "STEALTH",
            hasAbility: false,
            abilityID: 24,
            description: "Gain BLOCK or COVER benefits of TERRAIN even at up to 1 pencil distance from BLOCK or COVER features."
        },
        {
            name: "TAUNT",
            hasAbility: false,
            abilityID: 25,
            description: "Make an enemy FORCE attack this FORCE with its next turn."
        },
        ];
        this.isTurn = false;
        this.isDead = false;
        this.hitsTaken = 0;
        this.rollResults = [];
        this.freeRerolls = 10;
        this.forceType //one of 3 types only
        this.isCovered = false;
        this.reserveCount
        this.isBlocked = false;
        this.isCombined = false;
        this.isSlowed = false; //for rough terrain
        this.attackRange //range or melee
        this.inContactWith = []; //terrain or units in contact
        this.hasEmblem = false;
        this.isBannerTarget = false;
        this.getAbilities();
        this.calcNumbers();
        this.calcDamage;
        this.checkAbility;
    };
  
    getAbilities() {
      //use set() to get 1-3 unique random numbers based on tier
      const num = new Set();
      while(num.size !== this.unitTier) {
        num.add(getRndInteger(0, 24));
      }; // we have 25 abilities
      
      for (let i = 0; i < num.size; i++) {
        this.abilities[num.keys().next().value].hasAbility = true;
      }; // avoid a const by using keys.next
    }; // called at unit creation
  
    checkAbility(abilityID) {
      const matchingAbility = this.abilities.find(ability => ability.abilityID === abilityID);
      return matchingAbility ? matchingAbility.hasAbility : false;
    }; // return true if unit has a given ability with id
  
    calcNumbers() {
      if (this.unitTier === 3) {
          //is commander
          this.unitCount = 1;
          this.diceCount = 6;
          this.description = "Commander"
      } else if (this.unitTier === 2) {
          //is hero
          this.unitCount = 1;
          this.diceCount = 3;
          this.description = "Hero"
      } else if (this.unitTier === 1) {
          //is basic unit
          this.unitCount = 6;
          this.diceCount = 6;
          this.description = "Troop"
      } else { console.log("Error 310: trouble getting tier")}
    };
  
    calcDamage() {
      if (this.unitTier === 3) {
          //is commander
          if (this.hitsTaken >= 6) {
              this.unitCount -= this.hitsTaken;
              this.diceCount -= this.hitsTaken;
              this.hitsTaken = 0;
          } else {console.log("not enough for cmdr")};
      } else if (this.unitTier === 2) {
          //is hero
          if (this.hitsTaken >= 3) {
              this.unitCount -= this.hitsTaken;
              this.diceCount -= this.hitsTaken;
              this.hitsTaken = 0;
          } else {console.log("not enough for hero")};
      } else if (this.unitTier === 1) {
          //is basic unit
          this.unitCount -= this.hitsTaken;
          this.diceCount -= this.hitsTaken;
      } else { console.log("Error 485: trouble dealing dmg")};
      
      
      if (this.unitCount <= 0) {
          this.isDead = true;
      };
      if (this.freeRerolls < 0) {
          this.freeRerolls = 0;
      }; // we dont't want to go below 0 with this resource
    }; // we still need to consider armor and other skills
  
    rollAttacks(target) {
      console.log("Target this turn:", target)

      this.rollResults = [];
      let tempRolls = [];
  
      // Roll binary dice according to tier and diceCount
      // then store in temp rolls
      for (let i = 0; i < this.diceCount; i++) {
        tempRolls.push(getRndInteger(1, 2));
      };
      console.log("First attack roll:", tempRolls)
    
      // we need to check for range
  
      // we need to check for cover
  
      // Armor - check foe, reroll hits
      console.log("Target unit has ARMOR?", target.checkAbility(3));
      if (target.checkAbility(3)) {
        //console.log("Target has ARMOR, first rolls were", tempRolls)
        for (let i = 0; i < tempRolls.length; i++) {
          if (tempRolls[i] == 2) {
            tempRolls[i] = getRndInteger(1, 2);
            console.log("New attack roll against ARMOR", tempRolls)
          }
        }
      }; 
  
      // check MARKSMAN ability
      console.log("This unit is a MARKSMAN?", this.checkAbility(16));
      if (this.checkAbility(16)) {
        console.log("MARKSMAN's first rolls were", tempRolls)
        for (let i = 0; i < tempRolls.length; i++) {
          if (tempRolls[i] === 1) {
            tempRolls[i] = getRndInteger(1, 2);
            console.log("MARKSMAN's new attack rolls", tempRolls)
          }
        }
      }; 
  
      // check foe for BANNER target, reroll misses
      console.log("Target is marked by BANNER?", target.isBannerTarget);
      if (target.isBannerTarget === true) {
        console.log("Unit is a BANNER target, first rolls were", tempRolls)
        for (let i = 0; i < tempRolls.length; i++) {
          if (tempRolls[i] == 1) {
            tempRolls[i] = getRndInteger(1, 2);
            console.log("New attack roll against BANNER target", tempRolls)
          }
        }
      }; 
      
  
      // All other abilities to check for attack rolls
  
      // Artillery - attack more than 1 unit- pron in targeting
  
      // Banner - reroll misses if ally has this on a target
  
      // Bolster - anyone can have 1 die reroll
  
      // Demolish - takes 3 hits to destroy object
  
      // Fury - log any attacks with at least 1 hit for later
  
      // Heat Vision - ignore cover
  
      // Melee Reflexes - special 3 dice only attack
  
      // Power Up - similar to bolster in function
      console.log("Unit has POWER UP?", target.checkAbility(19));
      if (target.checkAbility(19) && this.freeRerolls > 0) {
        if (tempRolls.indexOf(1) !== -1) {
          this.freeRerolls--;
          tempRolls[tempRolls.indexOf(1)] = getRndInteger(1, 2);
          console.log("Used a POWER UP, new attack rolls:", tempRolls);
        }
      }; //room for intelligent AI here, some commanders might use
      // all free dice at any time, others may hoard for the right
      // moment, others may use 1 if they have at least 1.
  
      // Ranged Reflexes - similar function as Melee
  
      // After all checks, push temp rolls to main
      this.rollResults.push(...tempRolls);
    };
  
    evaluateAttacks() {
      let workingHits = 0;
      for (let i = 0; i < this.rollResults.length; i++) {
        
        if (this.rollResults[i] === 2) {
          //console.log(this.commander.name + "'s unit " + this.unitID + " rolled a hit!")
          workingHits++;
          //.commander.currentHits++;
          //console.log("Working hits " + this.commander.currentHits)
          //this.enemy.hitsTaken += i;
          //console.log("Enemy has taken " + this.enemy.hitsTaken + " hits.")
        }
      };
      return workingHits;
    };
  };