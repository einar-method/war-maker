///// MUSIC STUFF /////
//Background music
const bgMusicList = [
    "assets/01 Endless Wind.mp3",
    "assets/02 Fallen Crowns.mp3",
    "assets/03 Cairn Island Currents.mp3",
    "assets/04 Drums of Dalric.mp3",
];
let bgMusic = new Audio();
let bgMusicSrc = "";
bgMusic.loop = false;
bgMusic.volume = 0.5;
    
function runBgMusic() {
    
    const randomSong = bgMusicList[Math.floor(Math.random() * bgMusicList.length)];
    
    if (bgMusicSrc === randomSong) {
        console.log("same song, run again")
        runBgMusic();
    } else {
        console.log("playing new song")
        bgMusicSrc = randomSong;
        bgMusic.src = randomSong;
        bgMusic.play();
    
        bgMusic.addEventListener('ended', function () {
        console.log("song ended")
        runBgMusic();
        }, true);
    }
};

window.onload = (event) => {
  //runBgMusic();
};
    
    
/* // not needed yet
function fadeMusic(input) {
    let currentVolume = input.volume;
    if (currentVolume > 0.015) input.volume = input.volume - 0.01;
    if (currentVolume <= 0.015) input.pause();
} */