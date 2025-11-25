const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const workInput = document.getElementById("work-time");
const restInput = document.getElementById("rest-time");
const setsInput = document.getElementById("sets");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const muteBtn = document.getElementById("mute-btn");
const clockDisplay = document.getElementById("clock");

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

// Initial display
updateDisplay();