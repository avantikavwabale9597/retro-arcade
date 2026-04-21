const boardE1 = document.getElementById("board");
const timerE1 = document.getElementById("timer");
const mistakesE1 = document.getElementById("mistakes");
const modeText = document.getElementById("modeText");
const messageE1 = document.getElementById("message");

let size = 9;
let boxSize = 3;
let solution = [];
let puzzle = [];
let currentMode = "";
let mistakes = 0;
let seconds = 0;
let timeInterval = null;
