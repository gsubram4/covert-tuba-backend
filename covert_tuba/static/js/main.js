
// Placing globals here for now... need to think about how to manage games properly
var play_area = document.getElementById("board");
var control_panel_area = document.getElementById("game_controls");
var play_size = 3;
var game_board;
var game_state;

// Query params
var url_params = new URLSearchParams(window.location.search);

// Read game url if exists & connect
var incoming_game = url_params.get("room");
if (incoming_game) {
  GameMaster.joinGame(incoming_game);
}

//var start_game_state = new GameState();

// Build & render control panel
var controlPanel = new ControlPanel();
control_panel_area.appendChild(controlPanel.element);


function startGame() {
  game_state = new GameState();
  game_board = new Board(play_area, play_size);
  console.log(game_board);
  game_board.render(game_state);
  Network.createGame(null, play_size);
}


/* Probably will morph into a state manager of some sort */
var game_state = new GameState();
function updateBoard(state) {
  console.log("UPDATE BOARD", state);
  state = JSON.parse(state);
  game_board.render(state);
  // Need to contemplate how state should mutate -- full replace? Or other options
  game_state = state;
}

function makeMove(index) {
  var thisBoard = game_state.board;
  // Should pass to server & bring back with updateBoard
  // How much local validation should also occur?
  var player_token = game_state.active_player==0 ? "x" : "o";

  // Validate proper move
  if (thisBoard[index]) {
    shakeBoard();
    return;
  }

  // Make move & swap player turn
  thisBoard[index] = player_token;
  //game_state.active_player = game_state.active_player == 0 ? 1 : 0;
  //game_board.render(game_state);
  playMove(index);
}

function shakeBoard() {
  play_area.classList.remove("fadeIn");
  play_area.classList.remove("shake");
  SFX.playFail();
  setTimeout(function(){
    play_area.classList.add("shake");
  }, 50);
}

function GameState(board, active, winner) {
  // Player 0 == x
  // Player 1 == o
  return {
    board: board || new Array(play_size*play_size).fill(null),
    win_positions: [],
    active_player: active || 0,
    winner: winner || null
  };
};

function winDetection(board) {
  // Assume board is 1xn array
  var boardSize = Math.sqrt(board.length);
  
}