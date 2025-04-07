const Gameboard = (function () {
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  return { board };
})();

const Game = (function () {
  const tiles = document.querySelectorAll(".tiles");
  const resetBtn = document.querySelector(".reset");

  const tokens = ["X", "O"];
  let turnCount = 0;
  let currentTurn = tokens[turnCount % 2];


  const placeToken = (event) => {
      const rowIndex = Math.floor(event.target.dataset.target / 3);
      const colIndex = event.target.dataset.target % 3;
      play(rowIndex, colIndex);
  };

  const displayResults = (result) => {
    const results = document.querySelector(".results");
    results.style.display = "block";
    if (result === "win") {
      results.textContent = `${currentTurn} wins`;
      return;
    };
    if (!result) {
      results.textContent = "";
      results.style.display = "none";
      return;
    }
    results.textContent = "Draw";
    results.classList.add("draw");
  };

  const checkWin = () => {
    const win =
      (Gameboard.board[0][0] &&
        Gameboard.board[0][0] === Gameboard.board[0][1] &&
        Gameboard.board[0][1] === Gameboard.board[0][2]) ||
      (Gameboard.board[1][0] &&
        Gameboard.board[1][0] === Gameboard.board[1][1] &&
        Gameboard.board[1][1] === Gameboard.board[1][2]) ||
      (Gameboard.board[2][0] &&
        Gameboard.board[2][0] === Gameboard.board[2][1] &&
        Gameboard.board[2][1] === Gameboard.board[2][2]) ||
      (Gameboard.board[0][0] &&
        Gameboard.board[0][0] === Gameboard.board[1][0] &&
        Gameboard.board[1][0] === Gameboard.board[2][0]) ||
      (Gameboard.board[0][1] &&
        Gameboard.board[0][1] === Gameboard.board[1][1] &&
        Gameboard.board[1][1] === Gameboard.board[2][1]) ||
      (Gameboard.board[0][2] &&
        Gameboard.board[0][2] === Gameboard.board[1][2] &&
        Gameboard.board[1][2] === Gameboard.board[2][2]) ||
      (Gameboard.board[0][0] &&
        Gameboard.board[0][0] === Gameboard.board[1][1] &&
        Gameboard.board[1][1] === Gameboard.board[2][2]) ||
      (Gameboard.board[0][2] &&
        Gameboard.board[0][2] === Gameboard.board[1][1] &&
        Gameboard.board[1][1] === Gameboard.board[2][0]);

    console.table(Gameboard.board);

    if (win) {
      console.log(`${currentTurn} wins`);
      displayResults("win");
      tiles.forEach((tile) => {
        tile.removeEventListener("click", placeToken);
      });
      return;
    }

    if (!Gameboard.board.some((row) => row.includes(null))) {
      console.log("Draw");
      displayResults("draw");
      return;
    }

    console.log("No winner yet");
  };

  const play = (rowIndex, colIndex) => {
    if (Gameboard.board[rowIndex][colIndex]) return;

    Gameboard.board[rowIndex][colIndex] = currentTurn;
    turnCount++;
    checkWin();
    displayToken(tiles[3 * rowIndex + colIndex], currentTurn);
    currentTurn = tokens[turnCount % 2];
  };

  tiles.forEach((tile) => {
    tile.addEventListener("click", placeToken);
  });

  resetBtn.addEventListener("click", function() {
    tiles.forEach((tile) => {
      tile.replaceChildren();
    });

    Gameboard.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    tiles.forEach((tile) => {
      tile.addEventListener("click", placeToken);
    });

    turnCount = 0;
    currentTurn = tokens[turnCount % 2];
    displayResults();

    console.table(Gameboard.board);
  });

  return { play };
})();

function displayToken(tile, currentTurn) {
  const token = document.createElement("img");
  token.className = "token";
  token.src =
    currentTurn === "X"
      ? "assets/images/xmark.svg"
      : "assets/images/circle.svg";
  token.alt = currentTurn;

  tile.appendChild(token);
}

console.table(Gameboard.board);

// Game.play(0, 2);
// Game.play(1, 1);
// Game.play(0, 1);
// Game.play(0, 0);
// Game.play(2, 2);
// Game.play(1, 2);
// Game.play(1, 0);
// Game.play(2, 1);
// Game.play(2, 0);
