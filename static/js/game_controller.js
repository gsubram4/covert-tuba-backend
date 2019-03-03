var GameMaster = function(Network) {
  
  var hasInitialized = false;
  
  function createGame(size) {
    return Network.createGame(null, size);
  }

  function joinGame(id) {
    var name = id || prompt("Game ID?");
    if (!name) {
      alert("Name required to join game");
      return;
    }
    Network.joinGame(name);
  }

  function init_board(size) {
    game_state = new GameState();
    game_board = new Board(play_area, size);
    game_board.render(game_state);
  }
  
  function update_board(state) {
    if (!hasInitialized) init_board(state.size[0]);
    game_board.render(state);
    // Need to contemplate how state should mutate -- full replace? Or other options
    game_state = state;
  }
  
  Network.subscribeToBoardUpdate(update_board);
  
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
    Network.playMove(index);
  }
  
  return {
    createGame: createGame,
    joinGame: joinGame,
    makeMove: makeMove
  };
}(new NetworkInterface());
