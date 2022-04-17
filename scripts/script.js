
// Defining board size;
const boardSize = 8;

const piecesCount = {
  pawn: 8,
  rook: 2,
  knight: 2,
  bishop: 2,
  king: 1,
  queen: 1
}
let wPieces = [];
let bPieces = [];
// Setting 'load' event
window.addEventListener('load', createBoard);

function createBoard() {
  // Defining table element
  let table = document.createElement('table');
  // Appending table to body element
  document.body.appendChild(table);

  let r = document.createElement('tr');
  table.appendChild(r);
  r.appendChild(document.createElement('th'));
  for (let i = 0; i < boardSize; i++) {
    let h = document.createElement('th');
    h.classList.add('chess-board-label');
    h.innerHTML = String.fromCharCode('A'.charCodeAt(0)+ i);
    r.appendChild(h)
  }
  // for loop for creating the board squares
  for (let y = 0; y < boardSize; y++) {
    // running and creating the rows (y-axis)
    let row = document.createElement('tr');
    let counter = document.createElement('th');
    counter.innerHTML = y + 1;
    counter.classList.add('chess-board-label');
    row.appendChild(counter);
    // Defining the row
    for (let x = 0; x < boardSize; x++) {
      // running and creating the columns (x-axis)
      let id = `pos${x}-${y}`;
      // Defining a special id to each square
      let square = document.createElement('td');
      // Defining the cell
      square.id = id;
      // Assigning the id to the square
      square.classList.add('chess-square');
      square.setAttribute("onclick", "selectSquare(this)")
      // Adding a class to the square (css)
      if ((x + y) % 2 === 0) {
        // formula which desides wheather the square should be white or black
        square.classList.add('white-square');
        // Adding a class to the square (css) *white-square*
      } else {
        square.classList.add('black-square');
        // Adding a class to the square (css) *black-square*
      }
      // creating a image placeholder for the pieces * can ignore for now*
      let piece = document.createElement('img');
      piece.classList.add('chess-piece');

      // Appending placeholder to square
      square.appendChild(piece);
      // Appending square to row
      row.appendChild(square);
    }
    // Appending row to table
    table.appendChild(row);
  }

  resetBoard();
}


function resetBoard() {
  // Reseting board
  initializePieces();


}

function initializePieces() {
  // Creating all the pieces
  wPieces = [];
  bPieces = [];

  for (const key in piecesCount) {
    for (let i = 0; i < piecesCount[key]; i++) {
      wPieces.push(new Piece('w', key));
      bPieces.push(new Piece('b', key));
    }
  }

  setPiecesPositions();
  drawPieces();
}

function setPiecesPositions() {
  // Setting the pieces in their origin postion
  wPieces[0].pos = { x: 0, y: 6 }
  wPieces[1].pos = { x: 1, y: 6 }
  wPieces[2].pos = { x: 2, y: 6 }
  wPieces[3].pos = { x: 3, y: 6 }
  wPieces[4].pos = { x: 4, y: 6 }
  wPieces[5].pos = { x: 5, y: 6 }
  wPieces[6].pos = { x: 6, y: 6 }
  wPieces[7].pos = { x: 7, y: 6 }
  wPieces[8].pos = { x: 0, y: 7 }
  wPieces[9].pos = { x: 7, y: 7 }
  wPieces[10].pos = { x: 1, y: 7 }
  wPieces[11].pos = { x: 6, y: 7 }
  wPieces[12].pos = { x: 2, y: 7 }
  wPieces[13].pos = { x: 5, y: 7 }
  wPieces[14].pos = { x: 3, y: 7 }
  wPieces[15].pos = { x: 4, y: 7 }

  bPieces[0].pos = { x: 0, y: 1 }
  bPieces[1].pos = { x: 1, y: 1 }
  bPieces[2].pos = { x: 2, y: 1 }
  bPieces[3].pos = { x: 3, y: 1 }
  bPieces[4].pos = { x: 4, y: 1 }
  bPieces[5].pos = { x: 5, y: 1 }
  bPieces[6].pos = { x: 6, y: 1 }
  bPieces[7].pos = { x: 7, y: 1 }
  bPieces[8].pos = { x: 0, y: 0 }
  bPieces[9].pos = { x: 7, y: 0 }
  bPieces[10].pos = { x: 1, y: 0 }
  bPieces[11].pos = { x: 6, y: 0 }
  bPieces[12].pos = { x: 2, y: 0 }
  bPieces[13].pos = { x: 5, y: 0 }
  bPieces[14].pos = { x: 3, y: 0 }
  bPieces[15].pos = { x: 4, y: 0 }
}

function drawPieces() {
  // Drawing all pieces on the board
  for (let i = 0; i < wPieces.length; i++) {
    let piece = wPieces[i];
    let imgPath = `./img/${piece.color}-${piece.type}.png`;
    let pieceImgElement = document.getElementById(`pos${piece.pos.x}-${piece.pos.y}`).getElementsByTagName('img')[0];
    pieceImgElement.src = imgPath;
    pieceImgElement.alt = '';
  }

  for (let i = 0; i < bPieces.length; i++) {
    let piece = bPieces[i];
    let imgPath = `./img/${piece.color}-${piece.type}.png`;
    let pieceImgElement = document.getElementById(`pos${piece.pos.x}-${piece.pos.y}`).getElementsByTagName('img')[0];
    pieceImgElement.src = imgPath;
    pieceImgElement.alt = '';
  }
}

let prevSquare;
function selectSquare(e) {
  e.classList.add('selected-square');

  if (prevSquare) {
    prevSquare.classList.remove('selected-square');
  }
  prevSquare = e;
}
