const timerDisplay = document.getElementById('timerDisplay');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const pomodoroBtn = document.getElementById('pomodoroBtn');
const shortBreakBtn = document.getElementById('shortBreakBtn');
const longBreakBtn = document.getElementById('longBreakBtn');
const body = document.getElementById('body');

const DURATION = {
  POMODORO: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
};

let timerId = null;
let isRunning = false;
let currentMode = 'POMODORO';
let timeLeft = DURATION.POMODORO;

const synth = new Tone.Synth().toDestination();

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.title = `${timerDisplay.textContent} - ${currentMode.replace('_', ' ')}`;
}

function startTimer() {
  if (isRunning) return;
  Tone.start();
  isRunning = true;
  startPauseBtn.textContent = 'Pause';
  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      isRunning = false;
      startPauseBtn.textContent = 'Start';
      synth.triggerAttackRelease("C5", "0.5");
      resetTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerId);
  isRunning = false;
  startPauseBtn.textContent = 'Start';
}

function resetTimer() {
  pauseTimer();
  timeLeft = DURATION[currentMode];
  updateDisplay();
}

function switchMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  pomodoroBtn.classList.remove('active');
  shortBreakBtn.classList.remove('active');
  longBreakBtn.classList.remove('active');

  const themes = {
    POMODORO: { class: 'red', button: pomodoroBtn },
    SHORT_BREAK: { class: 'blue', button: shortBreakBtn },
    LONG_BREAK: { class: 'green', button: longBreakBtn },
  };

  body.className = themes[mode].class;
  themes[mode].button.classList.add('active');
  resetTimer();
}

startPauseBtn.addEventListener('click', () => {
  if (isRunning) pauseTimer();
  else startTimer();
});
resetBtn.addEventListener('click', resetTimer);

pomodoroBtn.addEventListener('click', () => switchMode('POMODORO'));
shortBreakBtn.addEventListener('click', () => switchMode('SHORT_BREAK'));
longBreakBtn.addEventListener('click', () => switchMode('LONG_BREAK'));

updateDisplay();
