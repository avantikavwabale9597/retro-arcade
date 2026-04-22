const wordEl = document.getElementById("word");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "cyan",
  "white",
  "lime",
];
const colorMap = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
  pink: "#ec4899",
  cyan: "#06b6d4",
  white: "#ffffff",
  lime: "#84cc16",
};

let currentColor = "";
let score = 0;
let timeLeft = 0;
let gameInterval;
let selectedTime = 30;

function startGame(time) {
  selectedTime = time;
  score = 0;
  timeLeft = time;

  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  messageEl.textContent = "";

  nextRound();

  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function nextRound() {
  const randomWord = colors[Math.floor(Math.random() * colors.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  currentColor = randomColor;

  wordEl.textContent = randomWord.toUpperCase();
  wordEl.style.color = colorMap[randomColor];
}

function checkAnswer(answer) {
  if (timeLeft <= 0) return;

  if (answer === currentColor) {
    score++;
    messageEl.textContent = "Correct!";
  } else {
    score--;
    messageEl.textContent = "Wrong!";
  }

  scoreEl.textContent = score;
  nextRound();
}
function restartGame() {
  clearInterval(gameInterval);

  score = 0;
  timeLeft = selectedTime;

  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  messageEl.textContent = "Restarted!";

  nextRound();

  gameInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(gameInterval);
  wordEl.textContent = "TIME UP!";
  wordEl.style.color = "#ffffff";
  messageEl.textContent = "Final Score: " + score;
}
