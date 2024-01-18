class War {
    constructor() { 
        this.warID = getRndID() + getHash();
        this.name //random cool stuff
        this.description //?
        this.commanders = [];
        //this.getCommanders();
        this.spark = new Battle(this.warID, 1, this.commanders[0], this.commanders[1]);
        this.retaliate = new Battle(this.warID, 2, this.commanders[0], this.commanders[1]);
        this.openWar = new Battle(this.warID, 3, this.commanders[0], this.commanders[1]);
        this.finalFront = new Battle(this.warID, 4, this.commanders[0], this.commanders[1]);
        this.stageNum = 0;
        this.currentBattle = null;
    };
  
    getCommanders() {
        this.commanders.push(new AICommander("Scotty", this, { side: 1, color: "green"}));
        this.commanders.push(new AICommander("Hank", this, { side: 2, color: "red"}));
        if (getRndInteger(1, 100) <= 50) {
            this.commanders[0].turnOrder = 1;
            this.commanders[1].turnOrder = 2;
        } else {
            this.commanders[0].turnOrder = 2;
            this.commanders[1].turnOrder = 1;
        }
    };
  
    getCurrentBattle() { 
      if (this.currentBattle == null) {
        this.currentBattle = this.spark;
        this.stageNum = 1;
      } else if (this.currentBattle == this.spark) {
        //is spark, skip to retaliate
        this.currentBattle = this.retaliate;
        this.stageNum = 2;
      } else if (this.currentBattle == this.retaliate) {
        //is retal, skip to open war
        this.currentBattle = this.openWar;
        this.stageNum = 3;
      } else if (this.currentBattle == this.openWar) {
        //is open war, skip to final front
        this.currentBattle = this.finalFront;
        this.stageNum = 4;
      } else if (this.currentBattle == this.finalFront) {
        //is final front, skip to conclusion
        console.log("end of war")
      }
  
      const bat = this.currentBattle.getBattleName()
      if (!bat.check) {
        return { check: false, turns: bat.turns };
      } else { return { check: true, turns: bat.turns, txt: bat.txt} }
  
    }

    generateRandomWar() {
        this.spark.getBattleDetails();
        this.retaliate.getBattleDetails();
        this.openWar.getBattleDetails();
        this.finalFront.getBattleDetails();
    }
};
  