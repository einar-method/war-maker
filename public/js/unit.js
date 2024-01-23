class Force {
    constructor(faction, num, { x = 0, y = 0} = {}, { side = null, color = null } = {}) {
        this.unitID =  getHash();
        this.owner = null;
        this.ownerRef = null;
        this.imageSrc = null;
        this.unitDice = 0;
        this.name = "";
        this.isIntializing = true;
        this.abilities = [
        {
            name: "AGILE",
            hasAbility: false,
            abilityID: 1,
            cost: 3,
            description: "Ignore ROUGH terrain."
        },
        {
            name: "ARTILLERY",
            hasAbility: false,
            abilityID: 2,
            cost: 3,
            description: "When HITS are rolled on a ranged attack, divide them in any array between targets in range."
        },
        {
            name: "ARMOR",
            hasAbility: false,
            abilityID: 3,
            cost: 3,
            description: "Re-roll HITS against this FORCE."
        },
        {
            name: "BUILDERS",
            hasAbility: false,
            abilityID: 4,
            cost: 3,
            description: "This FORCE can spend its turn to create a piece of BLOCK terrain. The new terrain is placed in contact with the BUILDERS."
        },
        {
            name: "BANNER",
            hasAbility: false,
            abilityID: 5,
            cost: 3,
            description: "Allies attacking this FORCE’s target re-roll MISSES."
        },
        {
            name: "BERZERK",
            hasAbility: false,
            abilityID: 6,
            cost: 3,
            description: "When using CHARGE, re-roll MISSES."
        },
        {
            name: "BOLSTER",
            hasAbility: false,
            abilityID: 7,
            cost: 3,
            description: "Use a turn to store 1 die. Give this die to any allied FORCE, use on any future roll."
        },
        {
            name: "DEMOLISH",
            hasAbility: false,
            abilityID: 8,
            cost: 3,
            description: "If in range of a terrain feature, roll 3 HITS to destroy that feature completely, removing it from battle."
        },
        {
            name: "DEFLECT",
            hasAbility: false,
            abilityID: 9,
            cost: 3,
            description: "Use a turn to store 1 die. Expend this die to absorb 1 single attack in the future, no matter its number of HITS."
        },
        {
            name: "EVASIVE",
            hasAbility: false,
            abilityID: 10,
            cost: 3,
            description: "Ranged attacks cannot hit this FORCE."
        },
        {
            name: "FAST",
            hasAbility: false,
            abilityID: 11,
            cost: 3,
            description: "Add a pencil to any movement rule when moving this FORCE."
        },
        {
            name: "FLIGHT",
            hasAbility: false,
            abilityID: 12,
            cost: 3,
            description: "This monster can leap or fly. It always DASHES, even when in a CHARGE, and goes over any terrain in its path."
        },
        {
            name: "FURY",
            hasAbility: false,
            abilityID: 13,
            cost: 3,
            description: "If this FORCE makes at least 1 HIT with an attack, it can attack again."
        },
        {
            name: "HEAT VISION",
            hasAbility: false,
            abilityID: 14,
            cost: 3,
            description: "Ignore the effect of COVER on your targets."
        },
        {
            name: "INTERVENTION",
            hasAbility: false,
            abilityID: 15,
            cost: 3,
            description: "If an ally within 1 pencil is attacked, move there instantly and take the attack. Use only before HIT dice are rolled."
        },
        {
            name: "MARKSMAN",
            hasAbility: false,
            abilityID: 16,
            cost: 3,
            description: "Re-roll MISSES on all ranged attacks."
        },
        {
            name: "MASSIVE",
            hasAbility: false,
            abilityID: 17,
            cost: 3,
            description: "This FORCE functions as BLOCK terrain. ***"
        },
        {
            name: "MELEE REFLEXES",
            hasAbility: false,
            abilityID: 18,
            cost: 3,
            description: "At the start of your turn, roll 3 HIT dice against any 1 enemy FORCE currently in contact."
        },
        {
            name: "POWER UP",
            hasAbility: false,
            abilityID: 19,
            cost: 3,
            description: "Use a turn to store 1 die. Use that die on any roll in future turns.***"
        },
        {
            name: "RALLY POINT",
            hasAbility: false,
            abilityID: 20,
            cost: 3,
            description: "RESERVES arrive at this FORCE’s location instantly.***"
        },
        {
            name: "RANGED REFLEXES",
            hasAbility: false,
            abilityID: 21,
            cost: 3,
            description: "At the start of your turn, roll 3 HIT dice against any 1 enemy FORCE within 1 pencil distance."
        },
        {
            name: "SIGNAL",
            hasAbility: false,
            abilityID: 22,
            cost: 3,
            description: "If moving towards this FORCE, friendly FORCES gain the FAST ABILITY."
        },
        {
            name: "SNIPER",
            hasAbility: false,
            abilityID: 23,
            cost: 3,
            description: "Use ranged attacks at up to 4 pencils distance."
        },
        {
            name: "STEALTH",
            hasAbility: false,
            abilityID: 24,
            cost: 3,
            description: "Gain BLOCK or COVER benefits of TERRAIN even at up to 1 pencil distance from BLOCK or COVER features."
        },
        {
            name: "TAUNT",
            hasAbility: false,
            abilityID: 25,
            cost: 3,
            description: "Make an enemy FORCE attack this FORCE with its next turn."
        },
        ];
        this.isTurn = false;
        this.isDead = false;
        this.rollResults = [];
        this.freeRerolls = 10;
        this.types = [
            {
                name: "REGULAR",
                isType: false,
                typeCost: 3,
                description: "REGULAR forces have 6 members, 1 ability, roll dice equal to current members, and lose 1 member per hit taken."
            },
            {
                name: "HEROIC",
                isType: false,
                typeCost: 6,
                description: "HEROIC forces have 1 member, 2 abilities, roll 3 dice, and take 3 hits to kill."
            },
            {
                name: "ELITE",
                isType: false,
                typeCost: 9,
                description: "ELITE forces have 1 member, 3 abilities, roll 6 dice, and take 6 hits to kill."
            },
        ];
        this.isCovered = false;
        this.reserveCount = 0;
        this.isSlowed = false;
        this.attackRange = 0;
        this.maxAbilities = 1;
        this.pastCost = 0;
        this.currentCost = 0;
        this.notes = "";
        this.setupTesting();
    };

    setupTesting() {
        //this.ownerRef = playerRef;
        //this.unitDice = Math.floor(Math.random() * 6) + 1;
        //this.isTurn = Math.random() < 0.5 ? false : true;
        //this.isDead = Math.random() < 0.5 ? false : true;
        this.isCovered = Math.random() < 0.5 ? false : true;
        this.reserveCount = Math.floor(Math.random() * 4);
        this.isSlowed = Math.random() < 0.5 ? false : true;
        //this.name = this.getCurrentType().name;
        //this.attackRange = 0; Math.random() < 0.5 ? "🏹" : "⚔️";
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

    rndDefaultImg() {
        this.imageSrc = defaultImages[Math.floor(Math.random() * defaultImages.length)];
    };

    removeUnit(section) {
        console.log("Attempting to remove unit with ID:", this.unitID);
        promptRemoveUnit(section, this);
    };
};