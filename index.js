const Gameboard = (function () {
  let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const getBoard = () => board;

  const setCell = (row, col, value) => {
    if (!board[row][col]) {
      board[row][col] = value;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = board.map((row) => row.map(() => null));
  };

  const isFull = () => board.every((row) => row.every((cell) => cell !== null));

  return { getBoard, setCell, resetBoard, isFull };
})();

const Player = function (name, token) {
  this.name = name;
  this.token = token;
}

const DisplayController = (() => {
  const tiles = document.querySelectorAll(".tiles");
  const output = document.querySelector(".output");
  const startBtn = document.querySelector(".start");

  const startGame = () => {
    startBtn.parentElement.style.opacity = "0";
    startBtn.parentElement.style.pointerEvents = "none";
  };

  const displayToken = (tile, token) => {
    if (tile.hasChildNodes()) return;

    const img = document.createElement("img");
    img.className = "token";
    img.src =
      token === "X" ? "assets/images/xmark.svg" : "assets/images/circle.svg";
    img.alt = token;
    tile.appendChild(img);
  };

  const showLine = (line) => {
    line.forEach((cell) => {
      const tileIndex = cell[0] * 3 + cell[1];
      tiles[tileIndex].style.backgroundColor = "#58d68d";
    });
  };

  const updateResults = (msg) => {
    if (msg === "win") {
      output.textContent = `${Game.currentPlayer().name} wins!`;
      output.style.backgroundColor = "#d5f5e3";
      output.style.color = "#27ae60";
      return;
    }

    output.textContent = "It's a draw!";
    output.style.backgroundColor = "#f0f0f0";
    output.style.color = "#7f8c8d";
    tiles.forEach((tile) => {
      tile.style.backgroundColor = "#c9c9c9";
    });
  };

  const displayTurn = (player) => {
    output.textContent = `${player.name}'s turn`;
    output.style.display = "block";
    if (player.token === "X") {
      output.style.backgroundColor = "#f9e79f";
      output.style.color = "#d35400";
    }
    if (player.token === "O") {
      output.style.backgroundColor = "#eaf6ff";
      output.style.color = "#2980b9";
    }
  };

  const clearBoard = () => {
    tiles.forEach((tile) => {
      tile.replaceChildren();
      tile.style.backgroundColor = "transparent";
    });
  };

  const getTileElements = () => tiles;

  return {
    startGame,
    displayToken,
    showLine,
    updateResults,
    displayTurn,
    clearBoard,
    getTileElements,
  };
})();

const Game = (function () {
  let players = [];
  let turn = 0;

  const initPlayers = () => {
    const player1Name = document.getElementById("player1").value || "X";
    const player2Name = document.getElementById("player2").value || "O";

    players = [
      new Player(player1Name, "X"),
      new Player(player2Name, "O")
    ];
  };

  const currentPlayer = () => players[turn % 2];

  const play = (row, col) => {
    if (!Gameboard.setCell(row, col, currentPlayer().token)) return;

    const tileIndex = row * 3 + col;
    const tile = DisplayController.getTileElements()[tileIndex];
    DisplayController.displayToken(tile, currentPlayer().token);

    const board = Gameboard.getBoard();
    const winner = checkWin(board);
    const draw = Gameboard.isFull();

    if (winner) {
      DisplayController.updateResults("win");
      return "win";
    }

    if (draw) {
      DisplayController.updateResults("draw");
      return "draw";
    }

    turn++;
    return;
  };

  const reset = () => {
    turn = 0;
  };

  const checkWin = (board) => {
    // Rows, columns, diagonals
    const lines = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    for (const line of lines) {
      if (line.every((cell) => board[cell[0]][cell[1]] === currentPlayer().token)) {
        DisplayController.showLine(line);
        return true;
      }
    }
  };

  return { play, reset, currentPlayer, initPlayers };
})();

const EventController = (() => {
  const tiles = DisplayController.getTileElements();
  const startBtn = document.querySelector(".start");
  const resetBtn = document.querySelector(".reset");

  const handleTileClick = (e) => {
    const index = e.currentTarget.dataset.target;
    const row = Math.floor(index / 3);
    const col = index % 3;

    const result = Game.play(row, col);

    if (result === "win") {
      DisplayController.updateResults("win");
      disableTiles();
    } else if (result === "draw") {
      DisplayController.updateResults("draw");
      disableTiles();
    } else {
      DisplayController.displayTurn(Game.currentPlayer());
    }
  };

  const disableTiles = () => {
    tiles.forEach((tile) => tile.removeEventListener("click", handleTileClick));
  };

  const enableTiles = () => {
    tiles.forEach((tile) => tile.addEventListener("click", handleTileClick));
  };

  const enableReset = () => {
    resetBtn.addEventListener("click", resetGame);
  };

  const startGame = () => {
    Game.initPlayers();
    DisplayController.startGame();
    enableReset();
    DisplayController.displayTurn(Game.currentPlayer());
    startBtn.removeEventListener("click", startGame);
  };

  const resetGame = () => {
    Game.initPlayers();
    DisplayController.clearBoard();
    Gameboard.resetBoard();
    Game.reset();
    DisplayController.displayTurn(Game.currentPlayer());
    enableTiles();
  };

  const init = () => {
    enableTiles();
    startBtn.addEventListener("click", startGame);
  };

  return { init };
})();

EventController.init();
