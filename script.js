const gameBoard = document.getElementById("game-board");
const scoreView = document.getElementById("score");
const undoButton = document.getElementById("undoButton");
const bestScoresView = document.getElementById("best-scores");
const bestScoresList = document.getElementById("best-scores-list");
const gameOverView = document.getElementById("game-over");
const GRID_SIZE = 4;

const Direction = {
  Left: "Left",
  Right: "Right",
  Up: "Up",
  Down: "Down",
};

let topScores = [
  ["Unknown 1", 0, getCurrentDateAndTime()],
  ["Unknown 2", 0, getCurrentDateAndTime()],
  ["Unknown 3", 0, getCurrentDateAndTime()],
  ["Unknown 4", 0, getCurrentDateAndTime()],
  ["Unknown 5", 0, getCurrentDateAndTime()],
  ["Unknown 6", 0, getCurrentDateAndTime()],
  ["Unknown 7", 0, getCurrentDateAndTime()],
  ["Unknown 8", 0, getCurrentDateAndTime()],
  ["Unknown 9", 0, getCurrentDateAndTime()],
  ["Unknown 10", 0, getCurrentDateAndTime()],
];

let nickname = "Player";

let boardArray;
let score = 0;
let undoArray;
let undoscore = 0;

// Chances of spawning values
const CHANCE_2 = 65;
const CHANCE_4 = 30;

let isGameOver = false;
let hasAlreadyWon = false;

window.onload = function () {
  setUpGame();
};

// Initial game setup
function setUpGame() {
  console.log("Setting up game");

  gameOverView.style.visibility = "hidden";
  isGameOver = false;
  hasAlreadyWon = false;

  boardArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  /* For testing
  boardArray = [
    [8, 16, 8, 16],
    [16, 8, 16, 8],
    [2, 4, 2, 4],
    [4, 4, 1024, 1024],
  ];*/

  undoArray = JSON.parse(JSON.stringify(boardArray));

  score = 0;
  updateScore();

  getTopScoresFromServer();

  gameBoard.innerHTML = "";
  // Create cells of the grid in html
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let cell = document.createElement("div");
      cell.id = i.toString() + j.toString(); // Cell ID will be its coordinates for example 00, 12, 30
      cell.className = "cell";
      setTile(cell, boardArray[i][j]);
      gameBoard.append(cell);
    }
  }

  spawnNewTile();
  spawnNewTile();

  console.log("Game set up");
}

// Animations
const showAnimation = [{ transform: "scale(0)" }, { transform: "scale(1)" }];
const showAnimationTiming = {
  duration: 300,
  iterations: 1,
};

// Add tile element to given cell
function setTile(cell, value, isNewTile = false) {
  let tile = document.createElement("div");
  tile.innerText = "";
  tile.className = "tile val";
  tile.className += value.toString();
  if (value > 0) {
    tile.innerText = value.toString();
    cell.innerHTML = "";
    cell.append(tile);
    if (isNewTile) {
      tile.animate(showAnimation, showAnimationTiming);
    }
  }
}

function updateBoard() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      cell = document.getElementById(i.toString() + j.toString());
      cell.innerHTML = "";
      setTile(cell, boardArray[i][j]);
    }
  }
}

function updateScore() {
  scoreView.innerText = score.toString();
}

function excludeZeros(row) {
  return row.filter((i) => i != 0);
}

//Slide given row or column
function slide(row) {
  row = excludeZeros(row);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
      if (row[i] == 2048 && !hasAlreadyWon) {
        hasAlreadyWon = true;
        document.getElementById("win-screen").style.visibility = "visible";
      }
    }
  }
  row = excludeZeros(row);

  while (row.length < GRID_SIZE) {
    row.push(0);
  }
  return row;
}

//For sliding left and right
function slideHorizontally(dir) {
  if (dir != Direction.Left && dir != Direction.Right) {
    console.log("WRONG DIRECTION");
    return;
  }

  undoButton.disabled = false;
  if (!isGameOver) {
    undoArray = JSON.parse(JSON.stringify(boardArray));
    undoscore = score;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    let row = boardArray[r].slice();

    if (dir == Direction.Left) {
      row = slide(row);
      boardArray[r] = row;
    } else if (dir == Direction.Right) {
      row.reverse();
      row = slide(row);
      boardArray[r] = row.reverse();
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      let tile = document.getElementById(r.toString() + c.toString());
      let num = boardArray[r][c];
      setTile(tile, num);
    }
  }

  updateBoard();
  updateScore();
  spawnNewTile();
}

// For sliding up and down
function slideVertically(dir) {
  if (dir != Direction.Up && dir != Direction.Down) {
    console.log("WRONG DIRECTION");
    return;
  }

  undoButton.disabled = false;

  if (!isGameOver) {
    undoArray = JSON.parse(JSON.stringify(boardArray));
    undoscore = score;
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let column = Array(
      boardArray[0][c],
      boardArray[1][c],
      boardArray[2][c],
      boardArray[3][c]
    );

    if (dir == Direction.Up) {
      column = slide(column);
    } else if (dir == Direction.Down) {
      column.reverse();
      column = slide(column);
      column.reverse();
    }

    for (let r = 0; r < GRID_SIZE; r++) {
      boardArray[r][c] = column[r];
      let tile = document.getElementById(r.toString() + c.toString());
      let num = boardArray[r][c];
      setTile(tile, num);
    }
  }
  updateBoard();
  updateScore();
  spawnNewTile();
}

// TODO: Add touch events
document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft" || e.code == "KeyA") {
    slideHorizontally(Direction.Left);
  } else if (e.code == "ArrowRight" || e.code == "KeyD") {
    slideHorizontally(Direction.Right);
  } else if (e.code == "ArrowUp" || e.code == "KeyW") {
    slideVertically(Direction.Up);
  } else if (e.code == "ArrowDown" || e.code == "KeyS") {
    slideVertically(Direction.Down);
  }
});

function spawnNewTile() {
  if (canSpawnNewTile()) {
    let spawned = false;
    while (!spawned) {
      r = Math.floor(Math.random() * 4);
      c = Math.floor(Math.random() * 4);
      if (boardArray[r][c] == 0) {
        boardArray[r][c] = randomTileValue();
        cell = document.getElementById(r.toString() + c.toString());
        setTile(cell, boardArray[r][c], true);
        spawned = true;
      }
    }
  }
  // TODO: Add check condition if player has avaliable moves

  if (!hasAvaliableMoves()) {
    gameOverView.style.visibility = "visible";
    isGameOver = true;
  }
}

// Randomize value of new spawned tile
function randomTileValue() {
  rand = Math.random() * 100;
  if (rand <= CHANCE_2) {
    return 2;
  } else if (rand > CHANCE_2 && rand <= CHANCE_2 + CHANCE_4) {
    return 4;
  } else {
    return 8;
  }
}

// Checks if we can spawn new tile
function canSpawnNewTile() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (boardArray[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
}

function undo() {
  gameOverView.style.visibility = "hidden";
  isGameOver = false;
  boardArray = JSON.parse(JSON.stringify(undoArray));
  score = undoscore;
  updateBoard();
  updateScore();
  undoButton.disabled = true;
}

function sendScore() {
  getTopScoresFromServer();
  topScores.push(Array(nickname, score, getCurrentDateAndTime()));
  topScores.sort((a, b) => b[1] - a[1]);
  topScores.pop();
  POSTData(topScores);
}

function getCurrentDateAndTime() {
  return new Date().toLocaleDateString();
}

function getTopScoresFromServer() {
  GETData((data) => {
    for (let i = 0; i < data.length; i++) {
      topScores[i] = [data[i]["nickname"], data[i]["score"], data[i]["date"]];
    }
  });
}

function toggleBestScores() {
  getTopScoresFromServer();
  bestScoresList.innerHTML = "";
  for (let i = 0; i < topScores.length; i++) {
    let newElement = document.createElement("li");
    newElement.innerText =
      topScores[i][0] + "|\t" + topScores[i][1] + "|\t" + topScores[i][2];
    bestScoresList.append(newElement);
  }
  if (bestScoresView.style.visibility == "hidden") {
    bestScoresView.style.visibility = "visible";
  } else {
    bestScoresView.style.visibility = "hidden";
  }
}

function hideWinScreen() {
  document.getElementById("win-screen").style.visibility = "hidden";
}

function gameOver() {
  userInput = document.getElementById("username").value;
  if (userInput != null && userInput.length > 0 && userInput.length < 60) {
    nickname = userInput;
  }
  gameOverView.style.visibility = "hidden";
  sendScore();
  setUpGame();
}

function hasAvaliableMoves() {
  if (canSpawnNewTile()) {
    return true;
  }
  for (let i = 0; i < GRID_SIZE; i++) {
    let column = Array(
      boardArray[0][i],
      boardArray[1][i],
      boardArray[2][i],
      boardArray[3][i]
    );
    if (checkRow(column)) {
      return true;
    } else if (checkRow(boardArray[i])) {
      return true;
    }
  }
  return false;
}

function checkRow(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      return true;
    }
  }
  return false;
}
