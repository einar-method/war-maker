class Battle {
    constructor(warID, stage, p1, p2) {
      this.id = warID
      this.isCustom = false; //not needed for auto gen
      this.stage = stage;
      this.isActive = null;
      this.player1 = p1;
      this.player2 = p2;
      this.sparkPositions = [
          {
            id: 1,
            name: "SPARK",
            description: "You’ll be in enemy territory",
            function: ""
          },
          {
            id: 2,
            name: "SPARK",
            description: "The battlefield will be a place of peace, easily razed",
            function: ""
          },
          {
            id: 3,
            name: "SPARK",
            description: "The battle will take place in a wilderness location",
            function: ""
          },
          {
            id: 4,
            name: "SPARK",
            description: "Terrible weather will batter all in a wilderness fight",
            function: ""
          },
          {
            id: 5,
            name: "SPARK",
            description: "The rubble of other conflicts will host the opening fight",
            function: ""
          },
          {
            id: 6,
            name: "SPARK",
            description: "The battle is joined in the cramped spaces of an urban location",
            function: ""
          },
          {
            id: 7,
            name: "SPARK",
            description: "A wide open natural space will host the battle",
            function: ""
          },
          {
            id: 8,
            name: "SPARK",
            description: "The battle will be waged on YOUR home ground",
            function: ""
          }
        ];
      this.sparkNumbers = [
          {
            id: 1,
            name: "SPARK",
            description: "The enemy will have the advantage with position and numbers",
            function: this.modifyForce(5, this.player2)
          },
          {
            id: 2,
            name: "SPARK",
            description: "The enemy has more FORCES, but scattered positions",
            function: ""
          },
          {
            id: 3,
            name: "SPARK",
            description: "FORCES will be evenly matched, but scattered all over",
            function: ""
          },
          {
            id: 4,
            name: "SPARK",
            description: "The FORCES will be evenly matched, opposite each other",
            function: ""
          },
          {
            id: 5,
            name: "SPARK",
            description: "FORCES matched, P2 in a tight cluster, P1 scattered",
            function: ""
          },
          {
            id: 6,
            name: "SPARK",
            description: "FORCES matched, P1 in a tight cluster, P2 scattered",
            function: ""
          },
          {
            id: 7,
            name: "SPARK",
            description: "You have greater numbers, but positioned in a scatter",
            function: ""
          },
          {
            id: 8,
            name: "SPARK",
            description: "You have the advantage with positioning and numbers",
            function: ""
          }
      ];
      this.retalStatus = [
          {
            id: 1,
            name: "RETALIATION",
            description: "You’ve over-extended, in a convoy back to home base",
            function: ""
          },
          {
            id: 2,
            name: "RETALIATION",
            description: "Your FORCES are working on repairs and manufacture",
            function: ""
          },
          {
            id: 3,
            name: "RETALIATION",
            description: "A small FORCE of yours has been cut off from their unit",
            function: ""
          },
          {
            id: 4,
            name: "RETALIATION",
            description: "Infantry pulled back, you only have HEROES and ELITES",
            function: ""
          },
          {
            id: 5,
            name: "RETALIATION",
            description: "Your ELITES are in recovery, but you’re fortified",
            function: ""
          },
          {
            id: 6,
            name: "RETALIATION",
            description: "A large convoy of WAR supplies is coming your way",
            function: ""
          },
          {
            id: 7,
            name: "RETALIATION",
            description: "Your FORCES are reduced, but in a heavily armed bunker",
            function: ""
          },
          {
            id: 8,
            name: "RETALIATION",
            description: "Your FORCES are dug in to their own home base",
            function: ""
          }
      ];
      this.retalPlan = [
          {
            id: 1,
            name: "RETALIATION",
            description: "A small group will wage guerrilla WAR to anger them",
            function: ""
          },
          {
            id: 2,
            name: "RETALIATION",
            description: "You will ravage civilian infrastructure where they least expect",
            function: ""
          },
          {
            id: 3,
            name: "RETALIATION",
            description: "Extra HEROES arrive to aid a stealthy attack",
            function: ""
          },
          {
            id: 4,
            name: "RETALIATION",
            description: "A huge siege vehicle has become available to use against them",
            function: ""
          },
          {
            id: 5,
            name: "RETALIATION",
            description: "A group of ONLY HEROES will attack head on",
            function: ""
          },
          {
            id: 6,
            name: "RETALIATION",
            description: "New fame! Fight with only SQUADS, twice normal numbers.",
            function: ""
          },
          {
            id: 7,
            name: "RETALIATION",
            description: "Spies reveal an effective demolitions weakness you exploit",
            function: ""
          },
          {
            id: 8,
            name: "RETALIATION",
            description: "Something else left out",
            function: ""
          },
  
      ];
      this.openObj = [
        {
          "id": 1,
          "description": "Take the objectives they already hold, or be defeated",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 2,
          "description": "Place 3 objectives, the VENDETTA holds 2. Take 3 total to win",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 3,
          "description": "The battle will take place in a wilderness location",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 4,
          "description": "There is only 1 objective, and it replenishes SQUADS in contact",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 5,
          "description": "There is only 1 objective, and whoever takes it wins",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 6,
          "description": "Place 2 objectives, each of you holding 1. Take both to win",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 7,
          "description": "Place 3 objectives, you hold 2. Take 3 total to win",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 8,
          "description": "The VENDETTA must take the 3 objectives you already hold",
          "name": "OPEN WAR",
          "function": ""
        }
      ];
      this.openTerrain = [
        {
          "id": 1,
          "description": "Place 3 major features before any FORCES are in place",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 2,
          "description": "Place 1 major feature before any FORCES are in place",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 3,
          "description": "Take turns placing, and alternate placing 1 terrain feature",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 4,
          "description": "Take turns placing, and alternate placing 1 terrain feature",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 5,
          "description": "Take turns placing, and alternate placing 1 terrain feature",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 6,
          "description": "Take turns placing, placing 1 terrain feature with your FORCES",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 7,
          "description": "Place 1 major feature after all FORCES are in place",
          "name": "OPEN WAR",
          "function": ""
        },
        {
          "id": 8,
          "description": "Place 3 major features after all FORCES are in place",
          "name": "OPEN WAR",
          "function": ""
        }
      ];    
      this.finalLocal = [
        {
          "id": 1,
          "description": "You’ll be in enemy territory",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 2,
          "description": "The battlefield will be a place of peace, easily razed",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 3,
          "description": "The battle will take place in a wilderness location",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 4,
          "description": "Terrible weather will batter all in a wilderness fight",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 5,
          "description": "The rubble of other conflicts will host the final fight",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 6,
          "description": "The battle is joined in the cramped spaces of an urban location",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 7,
          "description": "A wide open natural space will host the battle",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 8,
          "description": "The battle will be waged on YOUR home ground",
          "name": "FINAL FRONT",
          "function": ""
        }
      ];    
      this.finalChance = [
        {
          "id": 1,
          "description": "Betrayed! The OVERLORD takes 2 turns before you",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 2,
          "description": "Fight with the fog. Any ability that uses 2 PENCILS use only 1",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 3,
          "description": "Bomb. Give any 1 FORCE the SIEGE ABILITY",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 4,
          "description": "Bomb. Give any 2 FORCES the SIEGE ABILITY",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 5,
          "description": "Mercenary! Call RESERVE on any HERO a 4th time",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 6,
          "description": "Hidden numbers. Replenish your first injured SQUAD to full",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 7,
          "description": "Redeemed! When your last HERO falls, replace in a safe location",
          "name": "FINAL FRONT",
          "function": ""
        },
        {
          "id": 8,
          "description": "They’ve taken the bait! Take 2 turns before the OVERLORD",
          "name": "FINAL FRONT",
          "function": ""
        }
      ];    
      this.description1 = "";
      this.description2 = "";
      this.possibleWins //random num 1-16
      this.winConditionP1
      this.winConditionP2
      this.terrainArchetype //random num 1-8
      this.terrainFeatures //random num 1-8
      this.weather //random num 1-8
      this.event //random num 1-8
      this.allGrids = [] //array of all generated grids
      this.name = "";
      //this.getBattleName();
    };
  
    getBattleName() {
      //simplify syntax
      const p1 = this.player1;
      const p2 = this.player2;
      let a = null;
      let d = null;

      for (let i = 0; i < gridArr.length; i++) {
        gridArr[i].forceInside = [];
      }; // clear map
      
      // Get current stage and set it up
      if (this.stage === 1) {
          this.name = "SPARK";
          battleMods(this.sparkPositions, this, 1);
          battleMods(this.sparkNumbers, this, 2);
          
          this.modifyForce(5, this.player1);
          this.modifyForce(1, this.player2);
          // The int 1-2 represents the player from book
          //TO DO: make mod random and give to all below
      };
      if (this.stage === 2) {
          this.name = "RETALIATE";
          battleMods(this.retalStatus, this, 1);
          battleMods(this.retalPlan, this, 2);
      };
      if (this.stage === 3) {
          this.name = "OPEN WAR";
          battleMods(this.openObj, this, 1);
          battleMods(this.openTerrain, this, 2);
      };
      if (this.stage === 4) {
          this.name = "FINAL FRONT";
          battleMods(this.finalLocal, this, 1);
          battleMods(this.finalChance, this, 2);
      };
  
      // find current battle order (like a turn but bigger scope)
      if (p1.battleOrder === 0 && p2.battleOrder === 0) {
        // If the above condition is caught, it's start of war
        // so determine battle sides randomnly
        const num = getRndInteger(1, 2);
      
        p1.battleOrder = num === 1 ? 1 : 2;
        p2.battleOrder = num === 1 ? 2 : 1;
        console.log("p1 ord", p1.battleOrder)
        console.log("p2 ord", p2.battleOrder)
  
      } else if (p1.battleOrder === 1) {
          p2.battleOrder = 1;
          p1.battleOrder = 2;
          
      } else if (p2.battleOrder === 1) {
          p1.battleOrder = 1;
          p2.battleOrder = 2;
      } else { console.log("Error assigning battle order") }
  
      //temp fix
      if (p1.battleOrder === 1) {
        a = p1;
        d = p2;
      } else {
        a = p2;
        d = p1;
      }
  
      // Now that all mods are calc, assign battle forces
      if (!this.player1.assignBattleForces(isP1Automated) || !this.player2.assignBattleForces(isP2Automated)) {
        concludeWar();   
        return {check: false, turns: null};
      } else {
        const turns = a.name + " is the aggressor and " + d.name + " is the defender for the " + this.name;
        takeTurns(p1.battleOrder, p2.battleOrder, p1.battleForces, p2.battleForces);
        return {check: true, turns: turns, txt: this.name};    
      }
  
      
  
    };
  
    modifyForce(num, player) {
      player.numbersMod = num;
    }
};
  