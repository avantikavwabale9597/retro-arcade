const board = document.getElementById("cells");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const currentModeText = document.getElementById("currentMode");
const pauseBtn = document.getElementById("pauseBtn");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const overlayBtn = document.getElementById("overlayBtn");

const gridSize = 20;

const startX = 10;
const startY = 10;

let snake = [
  { x: startX, y: startY },
  { x: startX - 1, y: startY },
  { x: startX - 2, y: startY },
];

let food = {};
let dx = 1;
let dy = 0;
let score = 0;
let speed = 150;
let gameInterval;
let paused = false;
let currentMode = "Medium";

const foods = ["🍎", "🍏", "🫐", "🍌", "🥭", "🥝", "🍉", "🍓"];
let currentFoodEmoji = "🍎";

function getHighScoreKey() {
  return "snakeHighScore_" + currentMode.toLowerCase();
}

let highScore = localStorage.getItem(getHighScoreKey()) || 0;
highScoreText.textContent = highScore;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq, duration) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = freq;
  osc.type = "square";

  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  osc.start();

  osc.stop(audioCtx.currentTime + duration / 1000);
}

function eatSound() {
  playBeep(700, 100);
}

function gameOverSound() {
  playBeep(250, 300);
}

function clickSound() {
  playBeep(500, 80);
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  };

  currentFoodEmoji = foods[Math.floor(Math.random() * foods.length)];

  for (let part of snake) {
    if (part.x === food.x && part.y === food.y) {
      createFood();
      return;
    }
  }
}

function drawGame() {
  board.innerHTML = "";

  snake.forEach((part) => {
    const el = document.createElement("div");
    el.classList.add("snake");
    el.style.gridColumnStart = part.x + 1;
    el.style.gridRowStart = part.y + 1;
    board.appendChild(el);
  });

  const foodEl = document.createElement("div");
  foodEl.classList.add("food");
  foodEl.style.gridColumnStart = food.x + 1;
  foodEl.style.gridRowStart = food.y + 1;
  foodEl.style.display = "flex";
  foodEl.style.alignItems = "center";
  foodEl.style.justifyContent = "center";
  foodEl.style.fontSize = "22px";
  foodEl.textContent = currentFoodEmoji;

  board.appendChild(foodEl);
}

function moveSnake() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  };

  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    gameOver();
    return;
  }

  for (let part of snake) {
    if (head.x === part.x && head.y === part.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreText.textContent = score;
    eatSound();
    createFood();
  } else {
    snake.pop();
  }
}

function gameLoop() {
  if (!paused) {
    moveSnake();
    drawGame();
  }
}

document.addEventListener("keydown", (e) => {
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
  ) {
    e.preventDefault();
  }

  if (e.key === "ArrowUp" && dy !== 1) {
    dx = 0;
    dy = -1;
  } else if (e.key === "ArrowDown" && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (e.key === "ArrowLeft" && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (e.key === "ArrowRight" && dx !== -1) {
    dx = 1;
    dy = 0;
  } else if (e.key.toLowerCase() === "p") {
    togglePause();
  }
});

function setMode(mode) {
  clickSound();

  if (mode === "easy") {
    speed = 220;
    currentMode = "Easy";
  } else if (mode === "medium") {
    speed = 150;
    currentMode = "Medium";
  } else if (mode === "hard") {
    speed = 90;
    currentMode = "Hard";
  }

  currentModeText.textContent = currentMode;

  highScore = localStorage.getItem(getHighScoreKey()) || 0;
  highScoreText.textContent = highScore;

  restartGame();
}

function restartGame() {
  overlay.style.display = "none";
  clickSound();

  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];

  dx = 1;
  dy = 0;
  score = 0;
  paused = false;

  pauseBtn.textContent = "Pause";
  scoreText.textContent = score;

  createFood();
  drawGame();

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

function togglePause() {
  clickSound();
  paused = !paused;

  if (paused) {
    pauseBtn.textContent = "Resume";
  } else {
    pauseBtn.textContent = "Pause";
  }
}

function gameOver() {
  clearInterval(gameInterval);
  gameOverSound();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem(getHighScoreKey(), highScore);
    highScoreText.textContent = highScore;
  }

  overlay.style.display = "flex";
  overlayText.textContent = "Game Over! Score: " + score;
  overlayBtn.textContent = " Play Again";
}

function startGame() {
  restartGame();
}

createFood();
drawGame();
