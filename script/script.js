const gameBoard = document.getElementById("game-board");
const GRID_SIZE = 4;

let boardArray;
let score = 0;

window.onload = function () {
  setUpGame();
};

function setUpGame() {
  console.log("Setting up game");

  boardArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      let num = boardArray[i][j];
      gameBoard.append(cell);
    }
  }

  console.log("Game set up");
}
