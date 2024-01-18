class AICommander {
    constructor(name, war, { side = null, color = null } = {}) {
        this.ID = getRndID();
        this.name = name;
        this.war = war;
        this.battleOrder = 0;
        this.turnOrder = 0;
        this.isTurn = null;
        this.currentHits = 0; // not sure about this
        this.currentUnit = null; // should be null until needed
        this.currentTarget = null;
        this.side = side;
        this.color = color;
        //this.enemy = this.war.commanders[getFoe(this.war, this.war.commanders[0])];
        this.numbersMod = 0;
        this.forceCount = getRndInteger(3, 8); //better later
        this.allForces = [];
        this.battleForces = [];
        this.battleLosses = 0;
        this.totalLosses = 0;
        this.personality = getRnd8();
        this.tactics = getRnd8();
        this.tacticsText = this.checkTactics();
        this.personalityText = this.checkPersonality();
        this.readyToCreate = false;
        this.createForces();
    };

    checkPersonality() {
        try {
          const value = parseInt(this.personality);
      
          // Check if the parsed value is within the valid range
          if (value >= 1 && value <= 8) {
            // Switch case based on the personality value
            switch (value) {
              case 1:
                return "Stonewall: A steady, measured veteran, never shows emotion";
              case 2:
                return "The Tiger: A reluctant warrior who reveals fury when cornered";
              case 3:
                return "Shadow: One who employs trickery with every word and action";
              case 4:
                return "Black Widow: Patient and logical, emotionless";
              case 5:
                return "Iron Shield: A protector of all, one who despises violence";
              case 6:
                return "Spearhead: A righteous, self-sure who lives life with moxy";
              case 7:
                return "The Machine: A tireless marathoner, but aloof";
              case 8:
                return "Butcher: A ravager, one who devours all and demands more";
            }
          } else {
            throw new Error("Invalid personality value. Personality should be an integer between 1 and 8.");
          }
        } catch (error) {
          return "Error 114: " + error.message;
        }
    };

    checkTactics() {
        try {
          const tacticsValue = parseInt(this.tactics);
      
          // Check if the parsed value is within the valid range
          if (tacticsValue >= 1 && tacticsValue <= 8) {
            // Switch case based on the tactics value
            switch (tacticsValue) {
              case 1:
                return "Defensive to Fault: Your goal is to outlast them";
              case 2:
                return "Fortress: Whenever possible, fight from fortifications";
              case 3:
                return "Tenfold Force: You hate risk and employ an overkill approach";
              case 4:
                return "Ambusher: Surprise can be used in many ways";
              case 5:
                return "No Nonsense: A mixed approach to warfare";
              case 6:
                return "Unpredictable: You thrive on shocking your enemy";
              case 7:
                return "The Gambler: You overextend as a habit, trusting fate";
              case 8:
                return "Bold to a Fault: There is no defense, only attack";
            }
          } else {
            throw new Error("Invalid tactics value. Tactics should be an integer between 1 and 8.");
          }
        } catch (error) {
          return "Error: " + error.message;
        }
    };

    getEnemy() {
      return this.war.commanders.indexOf(this) > 0 ? 0 : 1;
    }

    createForces() {
        // for (let i = 0; i < this.forceCount; i++) {
        //     this.allForces.push(new Force(this, 1));
        // };

        // Pass a ref to self and assign a unit tier ex: (this, 3)
        this.allForces.push(...Array(this.forceCount).fill().map(() => new Force(this, 1, {}, { side: this.side, color: this.color})));
        // for (let i = 0; i < getRndInteger(1, 3); i++) {
        //     this.allForces.push(new Force(this, 2));
        // };
        this.allForces.push(...Array(getRndInteger(1, 3)).fill().map(() => new Force(this, 2, {}, { side: this.side, color: this.color})));
        this.allForces.push(new Force(this, 3, {}, { side: this.side, color: this.color}));
    };

    assignBattleForces(auto = false) { //100% automated atm
        // get from allForces[] and put some in battleForces[]
        const checker = this.allForces.filter(battleUnit => !battleUnit.isDead)
        //console.log(checker)

        if (checker.length > 0) {
        let count = 25 + this.numbersMod;

        while (checker.length < count) {
            count--;
            console.log("Battle forces too large, reducing by 1 to become", count)
            if (count >= checker.length) {
            break;
            }
        };

        // Push forces to battle if there is at least 1 unit left alive
        // or else, end the war.
        
        // Use the global shuffleArray function to radomize living unit index
        const shuffledForces = shuffleArray(checker.slice());

        //TO DO: code for handing the stages differently
        
        // Select the first 'count' units and push them to battleForces
        this.battleForces.push(...shuffledForces.slice(0, count));

        // if (auto) { //we need this to take turns
        //     takeTurns();
        //     /* for (let i = 0; i < this.battleForces.length; i++) {
        //         placeUnits(this.battleForces[i])
        //     } // this is only for auto place */
        // }

        if (!auto) {
            //await manual placement
            //one unit at a time can be placed,
            //then the next player goes
        }
        
        return true;
        } else {
            console.log("Someone has lost the war");
            //code for handling end of war
            //concludeWar();
            return false;
        }
    };

    calcLosses() {
      this.totalLosses = this.allForces.reduce((count, obj) => {
        if (obj.isDead === true) {
          count++;
        }
        return count;
      }, 0);

      return this.totalLosses;
    }; //add dead units from battle to total deaths
};