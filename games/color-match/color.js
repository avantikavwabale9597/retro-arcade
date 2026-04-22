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
