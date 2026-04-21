const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let mode = "";

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
  gameActive = true;

  if (mode === "pvp") {
    statusText.textContent = "Player X Turn";
  } else {
    statusText.textContent = "Your Turn (X)";
  }
}

function makeMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;

  if (checkWinner()) {
    statusText.textContent = currentPlayer + " Wins!";
    gameActive = false;
    return;
  }

  if (board.every((cell) => cell !== "")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  if (mode === "ai") {
    currentPlayer = "O";
    statusText.textContent = "Robot Thinking....";
    setTimeout(robotMove, 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = "Player" + currentPlayer + "Turn";
  }
}

function robotMove() {
  let empty = board
    .map((val, i) => (val === "" ? i : null))
    .filter((v) => v !== null);

  if (empty.length === 0) return;

  let move = empty[Math.floor(Math.random() * empty.length)];
  board[move] = "O";
  cells[move].textContent = "O";

  if (checkWinner()) {
    statusText.textContent = "Robot Wins!";
    gameActive = false;
    return;
  }

  if (board.every((cell) => cell !== "")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }
  currentPlayer = "X";
  statusText.textContent = "Your Turn (X)";
}

function checkWinner() {
  return wins.some((pattern) => {
    return pattern.every((i) => board[i] === currentPlayer);
  });
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  cells.forEach((cell) => (cell.textContent = ""));
  statusText.textContent = "Game Reset!";
}
