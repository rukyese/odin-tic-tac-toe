const Gameboard = (function () {
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const tokens = ["X", "O"];
  let turnCount = 0;
  let currentTurn = tokens[turnCount % 2];

  const checkWin = () => {
    const win =
      (board[0][0] &&
        board[0][0] === board[0][1] &&
        board[0][1] === board[0][2]) ||
      (board[1][0] &&
        board[1][0] === board[1][1] &&
        board[1][1] === board[1][2]) ||
      (board[2][0] &&
        board[2][0] === board[2][1] &&
        board[2][1] === board[2][2]) ||
      (board[0][0] &&
        board[0][0] === board[1][0] &&
        board[1][0] === board[2][0]) ||
      (board[0][1] &&
        board[0][1] === board[1][1] &&
        board[1][1] === board[2][1]) ||
      (board[0][2] &&
        board[0][2] === board[1][2] &&
        board[1][2] === board[2][2]) ||
      (board[0][0] &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]) ||
      (board[0][2] &&
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0]);

    console.table(board);

    if (win) {
      console.log(`${currentTurn} wins`);
      return;
    }

    if (!board.some((row) => row.includes(null))) {
      console.log("Draw");
      return;
    }

    console.log("No winner yet");
  };

  const play = (rowIndex, colIndex) => {
    if (board[rowIndex][colIndex]) return;

    board[rowIndex][colIndex] = currentTurn;
    turnCount++;
    checkWin();
    currentTurn = tokens[turnCount % 2];
  };

  return { board, play };
})();

console.table(Gameboard.board);

Gameboard.play(0, 2);
Gameboard.play(1, 1);
Gameboard.play(0, 1);
Gameboard.play(0, 0);
Gameboard.play(2, 2);
Gameboard.play(1, 2);
Gameboard.play(1, 0);
Gameboard.play(2, 1);
Gameboard.play(2, 0);
