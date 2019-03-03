var NetworkInterface = function() {
  
  //TODO: Move to config file
  var network_config = {
    "PROD": {
      "domain": "http://3.88.102.135",
      "port": "8000"
    },
    "DEV": {
      "domain": "http://3.88.102.135",
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
        resolve(data);
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
    joinGame: joinGame,
    subscribeToBoardUpdate: function(callback) {
      board_listeners.push(callback);
    }
  };
};
