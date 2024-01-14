function step1() {
    document.getElementById("log1").innerHTML = "step 1 done"


    const war = setupWar();
    document.getElementById("log1").innerHTML += "<br>✔️ "+war.p1;
    document.getElementById("log1").innerHTML += "<br>✔️ "+war.p2;

    const battle = startBattle();
    document.getElementById("log1").innerHTML += "<br><br>✔️ "+battle.txt;
    document.getElementById("log1").innerHTML += "<br>✔️ "+battle.bat;
    document.getElementById("log1").innerHTML += "<br>✔️ "+battle.p1;
    document.getElementById("log1").innerHTML += "<br>✔️ "+battle.p2;


}

function step2() {
    document.getElementById("log1").innerHTML += "<br>step 2 done"



}

function step3() {
    document.getElementById("log1").innerHTML += "<br>step 3 done"




}