var GameMaster = function(Network) {
  
  var hasInitialized = false;
  var game_state;
  var player_id;
  
  Network.subscribeToBoardUpdate(update_board);
  Network.subscribeToRoleUpdate(update_role);
  Network.subscribeToNotify(send_notification);
  
  function send_notification(msg_object) {
    Notification.show(msg_object.message, msg_object);
  }
  
  function createGame(size) {
    return Network.createGame(null, size).then(function(d){
      setPlayer(d.role);
      SFX.playSuccess(); 
      return d.name;
    });
  }
  
  function setPlayer(role) {
      player_id = role;
      game_board.setPlayer(role);
  }
  
  function restartGame() {
    return Network.restartGame().then(function(d) {
      SFX.playSuccess();
      return d;
    })
  }

  function joinGame(id) {
    var name = typeof(id)=="string" ? id : prompt("Game ID?");
    if (!name) {
      Notification.show("Name required to join game");
      SFX.playFail();
      return;
    }
    return Network.joinGame(name).then(function(d) {
      SFX.playSuccess();
      setPlayer(d.role);
      return d.name;
    });
  }

  function init_board(size) {
    game_state = new GameState({play_size:size});
    game_board = new Board(size);
    play_area.appendChild(game_board.element);
    game_board.render(game_state);
  }
  
  function update_role(d) {
    setPlayer(d.role);
  }
  
  function update_board(state) {
    if (!hasInitialized) init_board(state.size[0]);
    hasInitialized = true;
    
    // Check for win
    if (state.winner) {
      Notification.show("Winner winner! Congrats to " + state.winner, {duration: 5000});
      if (state.winner == state.active_player) {
        SFX.playSuccess();
      } else {
        SFX.playFail(); 
      }
    }
    
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
    
    SFX.playBlip(); 
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
    restartGame: restartGame,
    makeMove: makeMove,
    getPlayerId: function() {
      return player_id;
    }
  };
}(new NetworkInterface());
