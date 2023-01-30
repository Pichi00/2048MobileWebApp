const gameBoard = document.getElementById("game-board");
const scoreView = document.getElementById("score");
const GRID_SIZE = 4;

const Direction = {
  Left: "Left",
  Right: "Right",
  Up: "Up",
  Down: "Down",
};

let boardArray;
let score = 0;

// Chances of spawning values
const CHANCE_2 = 65;
const CHANCE_4 = 30;

window.onload = function () {
  setUpGame();
};

// Initial game setup
function setUpGame() {
  console.log("Setting up game");

  boardArray = [
    [0, 0, 0, 0],
    [0, 0, 2, 2],
    [0, 0, 4, 8],
    [0, 0, 0, 0],
  ];

  score = 0;
  updateScore();

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

  console.log("Game set up");
}

// Add tile element to gicen cell
function setTile(cell, value) {
  let tile = document.createElement("div");
  tile.innerText = "";
  tile.className = "tile";
  if (value > 0) {
    tile.innerText = value.toString();
    cell.innerHTML = "";
    cell.append(tile);
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

  for (let r = 0; r < GRID_SIZE; r++) {
    let row = boardArray[r];

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

  spawnNewTile();
  updateBoard();
  updateScore();
}

// For sliding up and down
function slideVertically(dir) {
  if (dir != Direction.Up && dir != Direction.Down) {
    console.log("WRONG DIRECTION");
    return;
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

  spawnNewTile();
  updateBoard();
  updateScore();
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
        spawned = true;
      }
    }
  }
  // TODO: Add check condition if player has avaliable moves
  /*else {
    alert("GAME OVER!");
  }*/
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
