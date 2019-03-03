var Board = function(boardEl, _gridsize) {
  var gridsize = gridsize || 3;
  var boardElements;
  var rendered = false;
  var boardDimensions = {
    boardSize: 0,
    cellSize: 0
  };


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
    boardEl.style.width = largest_dimension + "px";
    boardEl.style.height = largest_dimension + "px";
  }

  /* Consider making this stateless? */
  function updateState(newState) {
    state = newState;
    return getState();
  }
  function getState() {
    return state;
  }

  function render(state) {
    clearBoard();
    var board_state = state.board;
    var domBoard = board_state.map(buildCell);
    domBoard.forEach(function(cell){
      boardEl.append(cell);
    });
    var label = document.createElement("h4");
    label.innerText = "Current Player: " + state.active_player;
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
    if (rendered && !thisState && state[position]==thisState) return boardElements[position];
    var cell = document.createElement("div");
    cell.style.float = "left";
    cell.style.height = boardDimensions.cellSize + "px";
    cell.style.width = boardDimensions.cellSize + "px";
    cell.style.margin = "5px";
    cell.classList.add("cell");
    cell.style.display = "block";
    cell.style.visibility = "hidden";
    cell.dataset.index = position;
    cell.onclick = function() {makeMove(this.dataset.index);};

    setTimeout(function() {
      cell.classList.add("animated");
      cell.classList.add("flipInX");
      cell.style.visibility = "visible";

      if (thisState == "x") {
        var cross = document.createElement("div");
        cross.classList.add("cross");
        cross.style.left = boardDimensions.cellSize / 2 + "px";
        cross.style.top = boardDimensions.cellSize / 2 + "px";
        cross.style.transform = "scale(10) rotate(45deg)";
        cell.append(cross);
      }

      if (thisState == "o") {
        var cross = document.createElement("div");
        cross.classList.add("circle");
        cross.style.left = boardDimensions.cellSize / 2 + "px";
        cross.style.top = boardDimensions.cellSize / 2 + "px";
        cross.style.transform = "scale(8)";
        cell.append(cross);
      }
    }, 600*Math.random());


    return cell;
  }

  init();

  return {
    updateState: updateState,
    getState: getState,
    render: render
  }
};//(document.getElementById("board"), 3);
