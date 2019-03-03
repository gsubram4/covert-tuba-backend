var mid_game = new GameState(
  [null, "x", "o", null, "x", null, null, null, null],
  1
);

function generateRandomBoard() {
  var board = new Array(play_size*play_size).fill(null).map(function() {
    var rand = Math.random();
    if (rand>.8) return "x";
    if (rand<.5) return "o";
    return null;
  });
  var player = Math.random() > 0.5 ? 0 : 1;
  return new GameState(board, player);
}

function applyMidGame() {
  game_board.render(mid_game);
}

function applyRandomGame() {
  var random_board = generateRandomBoard();
  console.log(random_board);
  game_board.render(random_board);
}