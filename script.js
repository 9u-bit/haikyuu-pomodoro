// // YT IFrame API (for Music Player)
// let tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// let firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// let player; // Global player object

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const workInput = document.getElementById("work-time");
const restInput = document.getElementById("rest-time");
const setsInput = document.getElementById("sets");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const muteBtn = document.getElementById("mute-btn");
const clockDisplay = document.getElementById("clock");
const loadBtn = document.getElementById("load-playlist-btn");
const playlistInput = document.getElementById("playlist-link");
const playerDisplay = document.getElementById("player-display");
const playlistInputBox = document.getElementById("playlist-input");
const resetPlayerBtn = document.getElementById("reset-player-btn");
const spotifyPlayer = document.getElementById("spotify-player");

// Audio
// let bgMusic = new Audio("url");
// bgMusic.loop = true;
let endSound = new Audio ("assets/audio/comm_break.mp3");

let timer;
let isRunning = false;
let isWorkPhase = true;
let isBreak = false;
let currentSet = 1;
let totalSets = parseInt(setsInput.value);

// Timer state
let minutes = parseInt(workInput.value);
let seconds = 0;

// Update display
function updateDisplay() {
    document.getElementById("set-indicator").textContent = "Set " + currentSet + " of " + totalSets;
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");

    const phaseIndicator = document.getElementById("phase-indicator");
    if (!isRunning && currentSet > totalSets) {
        // phaseIndicator.textContent = ""; // 🎉 Well done! You finished all sets! NOTE: I DONT LIKE THIS HERE :C
    } else if (isBreak) {
        phaseIndicator.textContent = "";
    } 
    else {
        phaseIndicator.textContent = isWorkPhase ? "Work Time" : "Rest Time";
    }
}

// Clickable timer and clock

let swapMode = false;

clockDisplay.addEventListener("click", () => {
    if(!swapMode) {
        document.body.classList.add("swap-mode");
        swapMode = true;
    }
});

document.querySelector(".timer-display").addEventListener("click", () => {
    if(swapMode) {
        document.body.classList.remove("swap-mode");
        swapMode = false;
    }
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    
    const formattedTime = String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + " " + ampm;
    clockDisplay.textContent = formattedTime;
}

setInterval(updateClock, 1000);
updateClock();

function initTimer() {
    totalSets = parseInt(setsInput.value);
    minutes = parseInt(workInput.value);
    seconds = 0;
    currentSet = 1;
    isWorkPhase = true;
    isBreak = false;
    updateDisplay();
}

// Start timer
function startTimer() {
    if (isRunning) return;
    isRunning = true;

    //bgMusic.play();

    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                endSound.play();
                // currentSet++;

                // Switch phase
                isWorkPhase = !isWorkPhase;

                // Increment only after finishing work phase
                if (isWorkPhase) {
                    currentSet++;
                    if(currentSet > totalSets) {
                        isRunning = false;
                        updateDisplay();
                        return;
                    }
                }
                
                minutes = isWorkPhase
                    ? parseInt(workInput.value)
                    : parseInt(restInput.value);
                seconds = 0;
                //startTimer();
                isRunning = false;
                setTimeout(() => {
                    isBreak = false;
                    startTimer();
                }, 6000);
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        updateDisplay();
    }, 1000);
}

// Reset timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkPhase = true;
    currentSet = 1;
    minutes = parseInt(workInput.value);
    seconds = 0;
    updateDisplay();
    //bgMusic.pause();
    //bgMusic.currentTime = 0;
}

/* Mute toggle
muteBtn.addEventListener("click", () => {
    bgMusic.muted = !bgMusic.muted;
    endSound.muted = !endSound.muted;
    muteBtn.textContent = bgMusic.muted ? "🔇" : "🔈";
})
*/

// Button listeners
startBtn.addEventListener("click", () => {
    if(!isRunning) {
        initTimer();
        startTimer();
    }
})
resetBtn.addEventListener("click", resetTimer);

loadBtn.addEventListener("click", () => {
  const link = playlistInput.value.trim();

  if (link.includes("spotify.com")) {
    const embedLink = link.replace("open.spotify.com", "open.spotify.com/embed");

    // Inject iframe
    spotifyPlayer.innerHTML = `
      <iframe style="border-radius:12px" 
        src="${embedLink}" 
        width="100%" height="380" frameborder="0" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
      </iframe>
    `;

    playlistInputBox.style.display = "none";
    playerDisplay.style.display = "block";
    document.getElementById("playlist-name").textContent = "Spotify Playlist";
  } else {
    alert("Please enter a valid Spotify playlist link.");
  }
});

resetPlayerBtn.addEventListener("click", () => {
  spotifyPlayer.innerHTML = "";
  playerDisplay.style.display = "none";
  playlistInputBox.style.display = "block";
  playlistInput.value = "";
});

// // YT functions (for Music Player)
// function onYouTubeIframeAPIReady() {
//     player = new YT.Player('youtube-player', {
//         height: '200',
//         width: '100%',
//         events: {
//             'onReady': onPlayerReady,
//             'onStateChange': onPlayerStateChange
//         }
//     });
// }

// function onPlayerReady(event) {
//     console.log("YouTube Player ready");
// }

// function onPlayerStateChange(event) {

// }

// Initial display
updateDisplay();