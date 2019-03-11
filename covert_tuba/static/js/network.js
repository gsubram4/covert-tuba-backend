var NetworkInterface = function() {
  
  //TODO: Move to config file
  var network_config = {
    "PROD": {
      "domain": "./",
      "port": "8000"
    },
    "DEV": {
      "domain": "./",
      "port": "5000"
    }
  };
  
  var url_params = new URLSearchParams(window.location.search);
  var ENV = url_params.get("ENV");
  var current_config = ENV ? network_config[ENV] : network_config["PROD"];
  
  var domain = current_config.domain;
  var port = current_config.port;

  var room = "silly_mallard";

  var log = console.log.bind(this, "%cnetwork.js", "font-weight:bold;color:#006eff;");

  var socket = io.connect(domain + ":" + port);
  log(socket);
  
  // verify our websocket connection is established
  socket.on('connect', function() {
    log('Websocket connected!');
  });
  
  var msg_listeners = [];
  socket.on('send_notification', function(input) {
    log("send_notification", input);
    msg_listeners.forEach(function(listener){
      listener(input);
    });
  });

  var role_listeners = [];
  socket.on('role_change', function(input) {
    log("role_change", input);
    role_listeners.forEach(function(listener) {
      listener(input);
    });
  });

  // Handle board updates
  var board_listeners = [];
  socket.on('board_update', function(input) {
    log("board_update", input);
    board_listeners.forEach(function(listener) {
      listener(JSON.parse(input));
    })
    //updateBoard(input);
  });
  
  
  // createGame onclick - emit a message on the 'create' channel to 
  // create a new game with default parameters
  function createGame(name, size) {
    var created = new Promise(function(resolve, reject) {
      var options = {};
      if (name) options.name = name;
      options.board_size = size || 3;
      log('Creating game...', options);
      var emit = socket.emit('create_board', options, returnFromCreate);
      
      function returnFromCreate(data) {
        log("createGame", data);
        resolve(data);
      }
    });
    return created;
  }
  
  function restartGame() {
    var restarted = new Promise(function(resolve, reject) {
      
      log('Restarting game');
      
      var emit = socket.emit('restart_board', null, returnFromRestart);
      
      function returnFromRestart(data) {
        log("restartGame", data);
        resolve(data);
      }
    });
    
    return restarted;
  }

  function joinGame(name) {
    var joined = new Promise(joinedPromise);
    
    function joinedPromise(resolve, reject) {
      if (!name) {
        reject("NAME_REQUIRED");
      }
      var options = {
        name: name
      };
      var emit = socket.emit('join_board', options, returnFromJoin);
      
      function returnFromJoin(data) {
        log("joinGame", data);
        if (data.code == 200) resolve(data);
        if (data.code == 400) reject(data.message || "UNKNOWN_ERROR");
        reject("UNKNOWN_ERROR");
      }
    }
    
    return joined;
  }


  function playMove(idx) {
    var emit = socket.emit('play_move', idx, log.bind(null, "playMove"));
  }
  return {
    playMove: playMove,
    createGame: createGame,
    restartGame: restartGame,
    joinGame: joinGame,
    subscribeToBoardUpdate: function(callback) {
      board_listeners.push(callback);
    },
    subscribeToRoleUpdate: function(callback) {
      role_listeners.push(callback);
    },
    subscribeToNotify: function(callback) {
      msg_listeners.push(callback);
    }
  };
};
