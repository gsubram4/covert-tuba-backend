var GameMaster = function(Network) {
  
  var hasInitialized = false;
  var game_state;
  var player_id;
  
  Network.subscribeToBoardUpdate(update_board);
  
  function createGame(size) {
    return Network.createGame(null, size).then(function(d){
      console.log(d);
      return d.name;
    });
  }

  function joinGame(id) {
    var name = typeof(id)=="string" ? id : prompt("Game ID?");
    if (!name) {
      alert("Name required to join game");
      return;
    }
    return Network.joinGame(name).then(function(d) {
      console.log(d);
      return d.name;
    });
  }

  function init_board(size) {
    game_state = new GameState({play_size:size});
    game_board = new Board(size);
    play_area.appendChild(game_board.element);
    game_board.render(game_state);
  }
  
  function update_board(state) {
    if (!hasInitialized) init_board(state.size[0]);
    hasInitialized = true;
    game_board.render(state);
    // Need to contemplate how state should mutate -- full replace? Or other options
    game_state = state;
  }
  
  function GameState(options) {
    // Player 0 == x
    // Player 1 == o
    return {
      board: options.board || new Array(options.play_size*options.play_size).fill(null),
      win_positions: [],
      active_player: options.active || 0,
      winner: options.winner || null
    };
  };
  
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
