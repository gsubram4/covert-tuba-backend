var domain = "http://107.22.89.117";
var port = "5000";

var socket = io.connect(domain + ":" + port);
console.log(socket);
// verify our websocket connection is established
socket.on('connect', function() {
  console.log('Websocket connected!');
});
// message handler for the 'join_room' channel
socket.on('join_room', function(msg) {
  console.log(msg);
});

socket.on('update_board', updateBoard);
// createGame onclick - emit a message on the 'create' channel to 
// create a new game with default parameters
function createGame() {
  console.log('Creating game...');
  socket.emit('create', {size: 'normal', teams: 2, dictionary: 'Simple'});
}
