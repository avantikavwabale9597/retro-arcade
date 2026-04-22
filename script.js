function formatTime(sec) {
  sec = Number(sec);
  let min = String(Math.floor(sec / 60)).padStart(2, "0");
  let s = String(sec % 60).padStart(2, "0");
  return `${min}:${s}`;
}

function loadScores() {
  let sE = localStorage.getItem("snakeHighScore_easy");
  let sM = localStorage.getItem("snakeHighScore_medium");
  let sH = localStorage.getItem("snakeHighScore_hard");

  document.getElementById("snakeScore").textContent =
    sE || sM || sH
      ? "Best → " +
        (sE ? "E: " + sE + " " : "") +
        (sM ? "M: " + sM + " " : "") +
        (sH ? "H: " + sH : "")
      : "No score yet";

  let e = localStorage.getItem("sudokuBest_easy");
  let m = localStorage.getItem("sudokuBest_medium");
  let h = localStorage.getItem("sudokuBest_hard");

  document.getElementById("sudokuScore").textContent =
    e || m || h
      ? "Best → " +
        (e ? "E: " + formatTime(e) + " " : "") +
        (m ? "M: " + formatTime(m) + " " : "") +
        (h ? "H: " + formatTime(h) : "")
      : "No score yet";

  let color = localStorage.getItem("colorHighScore");

  document.getElementById("colorScore").textContent = color
    ? "High Score: " + color
    : "No score yet";
}

window.onload = loadScores;
