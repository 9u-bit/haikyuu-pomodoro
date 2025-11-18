const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const workInput = document.getElementById("work-time");
const restInput = document.getElementById("rest-time");
const setsInput = document.getElementById("sets");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const muteBtn = document.getElementById("mute-btn");

// Audio
// let bgMusic = new Audio("url");
// bgMusic.loop = true;
let endSound = new Audio ("assets/audio/comm_break.mp3");

let timer;
let isRunning = false;
let isWorkPhase = true;
let currentSet = 1;
let totalSets = parseInt(setsInput.value);

// Timer state
let minutes = parseInt(workInput.value);
let seconds = 0;

// Update display
function updateDisplay() {
    document.getElementById("set-indicator").textContent = `Set ${currentSet} of ${totalSets}`;
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

// Start timer
function startTimer() {
    if (isRunning) return;
    isRunning = true;
    totalSets = parseInt(setsInput.value);
    //bgMusic.play();

    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                endSound.play();
                currentSet++;

                if (currentSet > totalSets) {
                    isRunning = false;
                    return;
                }

                isWorkPhase = !isWorkPhase;
                minutes = isWorkPhase
                    ? parseInt(workInput.value)
                    : parseInt(restInput.value);
                seconds = 0;
                //startTimer();
                isRunning = false;
                setTimeout(() => startTimer(), 6000);
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
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

// Initial display
updateDisplay();