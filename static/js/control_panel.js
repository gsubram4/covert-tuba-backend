// TIC TAC TOE SPECIFIC
// NEED TO THINK ABOUT MORE GENERIC COMPONENTS
// LATER THO


var ControlPanel = function() {
  
  var panel = new Panel();
  
  // Title
  var title = document.createElement("h2");
  title.innerText = "COVERT TUBA";
  applyStyle(title, TextStyle);
  title.style.textAlign = "center";
  panel.appendChild(title);
  
  // Create Game
  var creation_area = document.createElement("div");
  var create_board_button = new Button("Create Game", GameMaster.createGame.bind(null, 3), {hover: "whitesmoke"});
  creation_area.appendChild(create_board_button);
  
  // Option Buttons
  // Removing for now to focus on finishing the game
  /*
  var play_options = [3,4,5];
  var buttons = play_options.map(function(el) {return new GridButton(el)});
  buttons.forEach(function(el) {
    creation_area.appendChild(el.element);
  });
  */
  
  panel.appendChild(creation_area);
  
  // Join Game
  var join_board_button = new Button("Join Game", GameMaster.joinGame);
  panel.appendChild(join_board_button);
  
  return {
    element: panel
  };
}



/**
 * TicTacToe grid button constructor
 * @param  {[type]} gridSize [description]
 * @return {[type]}          [description]
 */
var GridButton = function(gridSize) {
  
  var parent_container = new Button("", function(evt) {
    evt.srcElement.style.backgroundColor = "red";
  });
  
  parent_container.style.height = "50px";
  parent_container.style.width = "50px";
  parent_container.style.backgroundImage = getResourceUrl(gridSize);
  parent_container.style.backgroundSize = "30px";
  parent_container.style.backgroundPosition = "10px";
  parent_container.style.backgroundRepeat = "no-repeat";
  
  function getResourceUrl(gridSize) {
    var image_map = {
      3: "./img/3x3.svg",
      4: "./img/4x4.svg",
      5: "./img/5x5.svg",
    };
    return castResourceToCSSUrl(image_map[gridSize]);
  }
  
  function castResourceToCSSUrl(path) {
    return "url(" + path + ")";
  }
  
  return {
    element: parent_container,
    toggle: false
  };
}