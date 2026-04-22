const boardEl = document.getElementById("board");
const timerEl = document.getElementById("timer");
const mistakesEl = document.getElementById("mistakes");
const modeText = document.getElementById("modeText");
const messageEl = document.getElementById("message");

let size = 9;
let boxSize = 3;
let solution = [];
let puzzle = [];
let currentMode = "";
let mistakes = 0;
let seconds = 0;
let timeInterval = null;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq, time) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = freq;
  osc.type = "square";

  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  osc.start();
  osc.stop(audioCtx.currentTime + time / 1000);
}

const clickSound = () => beep(500, 80);
const correctSound = () => beep(700, 90);
const wrongSound = () => beep(220, 180);
const winSound = () => beep(900, 250);
const loseSound = () => beep(150, 350);

function formatTime(sec) {
  let min = String(Math.floor(sec / 60)).padStart(2, "0");
  let s = String(sec % 60).padStart(2, "0");
  return `${min}:${s}`;
}

function startGame(mode) {
  clickSound();

  currentMode = mode;
  mistakes = 0;
  seconds = 0;

  mistakesEl.textContent = "0/3";
  timerEl.textContent = "00:00";

  modeText.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);

  // 🔥 SHOW BEST TIME
  let best = localStorage.getItem("sudokuBest_" + currentMode);
  messageEl.textContent = best ? "Best: " + formatTime(best) : "Game Started!";

  if (mode === "easy") {
    size = 4;
    boxSize = 2;
  } else {
    size = 9;
    boxSize = 3;
  }

  generateSudoku();
  renderBoard();
  startTimer();
}

function restartGame() {
  if (!currentMode) return;
  startGame(currentMode);
}

function startTimer() {
  clearInterval(timeInterval);

  timeInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = formatTime(seconds);
  }, 1000);
}

function generateSudoku() {
  solution = Array(size)
    .fill()
    .map(() => Array(size).fill(0));

  fillBoard(solution);
  puzzle = solution.map((row) => [...row]);

  let removeCount = 0;

  if (currentMode === "easy") removeCount = 6;
  if (currentMode === "medium") removeCount = 40;
  if (currentMode === "hard") removeCount = 55;

  while (removeCount > 0) {
    let r = Math.floor(Math.random() * size);
    let c = Math.floor(Math.random() * size);

    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removeCount--;
    }
  }
}

function fillBoard(grid) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === 0) {
        let nums = shuffle([...Array(size).keys()].map((n) => n + 1));

        for (let num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            if (fillBoard(grid)) return true;

            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(grid, row, col, num) {
  for (let i = 0; i < size; i++) {
    if (grid[row][i] === num) return false;
    if (grid[i][col] === num) return false;
  }

  let startRow = Math.floor(row / boxSize) * boxSize;
  let startCol = Math.floor(col / boxSize) * boxSize;

  for (let r = 0; r < boxSize; r++) {
    for (let c = 0; c < boxSize; c++) {
      if (grid[startRow + r][startCol + c] === num) return false;
    }
  }

  return true;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.classList.remove("win");

  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  const box = size === 9 ? 3 : 2;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const input = document.createElement("input");
      input.classList.add("cell");
      input.maxLength = 1;

      if ((c + 1) % box === 0 && c !== size - 1) {
        input.style.borderRight = "3px solid #6b7280";
      }

      if ((r + 1) % box === 0 && r !== size - 1) {
        input.style.borderBottom = "3px solid #6b7280";
      }

      if ((Math.floor(r / box) + Math.floor(c / box)) % 2 === 0) {
        input.classList.add("box-dark");
      }

      if (puzzle[r][c] !== 0) {
        input.value = puzzle[r][c];
        input.disabled = true;
        input.classList.add("prefilled");
      } else {
        input.addEventListener("input", () => checkInput(input, r, c));
      }

      boardEl.appendChild(input);
    }
  }
}

function checkInput(input, row, col) {
  let raw = input.value.trim();
  if (raw === "") return;

  let val = Number(raw);

  if (isNaN(val) || raw.includes(".") || val < 1 || val > size) {
    wrongMove(input, "Only numbers allowed!");
    return;
  }

  if (val === solution[row][col]) {
    input.classList.remove("wrong");
    puzzle[row][col] = val;
    correctSound();
    messageEl.textContent = "Correct!";
    checkWin();
  } else {
    wrongMove(input, "Wrong number!");
  }
}

function wrongMove(input, text) {
  wrongSound();

  input.classList.add("wrong");
  input.value = "";

  mistakes++;
  mistakesEl.textContent = mistakes + "/3";

  messageEl.textContent = text;

  setTimeout(() => {
    input.classList.remove("wrong");
  }, 300);

  if (mistakes >= 3) {
    gameOver();
  }
}

function checkWin() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (puzzle[r][c] === 0) return;
    }
  }

  clearInterval(timeInterval);
  winSound();

  // 🔥 CHECK NEW RECORD
  let key = "sudokuBest_" + currentMode;
  let oldBest = localStorage.getItem(key);

  if (!oldBest || seconds < Number(oldBest)) {
    localStorage.setItem(key, seconds);
    messageEl.textContent = "New Record! 🎉 " + formatTime(seconds);
  } else {
    messageEl.textContent = "Solved! Time: " + formatTime(seconds);
  }

  boardEl.classList.add("win");
}

function gameOver() {
  clearInterval(timeInterval);
  loseSound();

  messageEl.textContent = "Game Over! 3 Mistakes";
  renderSolution();
}

function renderSolution() {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  const box = size === 9 ? 3 : 2;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const div = document.createElement("div");
      div.classList.add("cell", "prefilled");

      div.style.display = "flex";
      div.style.justifyContent = "center";
      div.style.alignItems = "center";

      if ((c + 1) % box === 0 && c !== size - 1) {
        div.style.borderRight = "3px solid #6b7280";
      }

      if ((r + 1) % box === 0 && r !== size - 1) {
        div.style.borderBottom = "3px solid #6b7280";
      }

      if ((Math.floor(r / box) + Math.floor(c / box)) % 2 === 0) {
        div.classList.add("box-dark");
      }

      div.textContent = solution[r][c];
      boardEl.appendChild(div);
    }
  }
}
