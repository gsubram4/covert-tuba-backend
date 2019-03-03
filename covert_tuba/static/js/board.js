var Board = function(boardEl, _gridsize) {
  var gridsize = _gridsize || 5;
  var boardElements;
  var rendered = false;
  var boardDimensions = {
    boardSize: 0,
    cellSize: 0
  };

  var log = console.log.bind(this, "%cboard.js", "font-weight:bold;color:#55a147;");

  /* Initialize board graphics */
  function init() {
    // Padding on board in %
    var boardPadding = 0.15;
    var largest_dimension = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
    boardDimensions.cellSize = Math.floor(
      (1 - boardPadding) * largest_dimension / gridsize
    );
    boardDimensions.boardSize = boardDimensions.cellSize * gridsize;
    boardEl.style.marginLeft = (largest_dimension * boardPadding / 2 - gridsize * 5) + "px";
    boardEl.style.width = getPixelSize(largest_dimension);
    boardEl.style.height = getPixelSize(largest_dimension);
  }

  
  /**
   * @param state {object}
   * @param renderOptions {object}
   *        - renderDelay {int} 
   */
  function render(state, renderOptions) {
    log("RENDER CALLED", state);
    clearBoard();
    var board_state = state.board;
    var domBoard = board_state.map(buildCell);
    domBoard.forEach(function(cell, position){
      if (state.win_positions && state.win_positions.indexOf(position)>-1) {
        cell.style.backgroundColor = "green";
      }
      boardEl.append(cell);
    });
    var label = document.createElement("h4");
    //label.innerText = "Current Player: " + state.active_player;
    boardEl.appendChild(label);
    boardElements = domBoard;
    rendered = true;
  }

  function clearBoard() {
    while (boardEl.firstChild) {
      boardEl.removeChild(boardEl.firstChild);
    }
  }

  function buildCell(thisState, position, state) {
    var renderDelay = 50;
    if (rendered && !thisState) return boardElements[position];
    var cell = document.createElement("div");
    cell.style.float = "left";
    cell.style.height = getPixelSize(boardDimensions.cellSize);
    cell.style.width = getPixelSize(boardDimensions.cellSize);
    cell.style.margin = "5px";
    cell.classList.add("cell");
    cell.style.display = "block";
    cell.style.visibility = "hidden";
    cell.dataset.index = position;
    cell.onclick = function() {GameMaster.makeMove(this.dataset.index);};
    
    var cellMarker = generateMarker(thisState, boardDimensions.cellSize);
    cell.append(cellMarker);

    // TODO: Add render delay
    setTimeout(function() {
      cell.classList.add("animated");
      cell.classList.add("jackInTheBox");
      cell.style.visibility = "visible";
    }, renderDelay*Math.random());


    return cell;
  }
  
  /**
   * Marker DOM Element generation method
   * @param  {string} player      'x' or 'o'
   * @param  {interval} cellSize  size of one dimension of cell in pixels
   * @return {DOMElement}         DOM Element representing marker
   */
  function generateMarker(player, cellSize) {
    log("Inside generate marker", player);
    var marker = document.createElement("div");
    marker.style.left = getPixelSize(cellSize / 4);
    marker.style.top = getPixelSize(cellSize / 4);
    marker.style.width = getPixelSize(cellSize / 2);
    marker.style.height = getPixelSize(cellSize / 2);
    marker.style.backgroundSize = getPixelSize(cellSize / 2);
    marker.style.position = "absolute";
    marker.style.backgroundImage = getMarkerIconPath(player);
    return marker;
  }
  
  function getMarkerIconPath(player) {
    if (!player) return "";
    var icon_map = {
      X: "./img/x.svg",
      O: "./img/o.svg"
    };
    var resource = icon_map[player.toUpperCase()];
    return castResourceToCSSUrl(resource);
  }
  
  function castResourceToCSSUrl(path) {
    return "url(" + path + ")";
  }
  
  function getPixelSize(pixels) {
    return pixels + "px";
  }

  init();

  return {
    render: render
  }
};//(document.getElementById("board"), 3);
