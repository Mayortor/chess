
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
      switch (key) {
        case 'pawn':
          wPieces.push(new Pawn('w'));
          bPieces.push(new Pawn('b'));
          break;
        case 'rook':
          wPieces.push(new Rook('w'));
          bPieces.push(new Rook('b'));
          break;
        case 'knight':
          wPieces.push(new Knight('w'));
          bPieces.push(new Knight('b'));
          break;
        case 'bishop':
          wPieces.push(new Bishop('w'));
          bPieces.push(new Bishop('b'));
          break;
        case 'queen':
          wPieces.push(new Queen('w'));
          bPieces.push(new Queen('b'));
          break;
        case 'king':
          wPieces.push(new King('w'));
          bPieces.push(new King('b'));
          break;
      }
    }
  }

  setPiecesPositions();
  drawPieces();
}

function setPiecesPositions() {
  // Setting the pieces in their origin postion
  wPieces[0].pos = { x: 0, y: 6 };
  wPieces[1].pos = { x: 1, y: 6 };
  wPieces[2].pos = { x: 2, y: 6 };
  wPieces[3].pos = { x: 3, y: 6 };
  wPieces[4].pos = { x: 4, y: 6 };
  wPieces[5].pos = { x: 5, y: 6 };
  wPieces[6].pos = { x: 6, y: 6 };
  wPieces[7].pos = { x: 7, y: 6 };
  wPieces[8].pos = { x: 0, y: 7 };
  wPieces[9].pos = { x: 7, y: 7 };
  wPieces[10].pos = { x: 1, y: 7 };
  wPieces[11].pos = { x: 6, y: 7 };
  wPieces[12].pos = { x: 2, y: 7 };
  wPieces[13].pos = { x: 5, y: 7 };
  wPieces[14].pos = { x: 3, y: 7 };
  wPieces[15].pos = { x: 4, y: 7 };

  bPieces[0].pos = { x: 0, y: 1 };
  bPieces[1].pos = { x: 1, y: 1 };
  bPieces[2].pos = { x: 2, y: 1 };
  bPieces[3].pos = { x: 3, y: 1 };
  bPieces[4].pos = { x: 4, y: 1 };
  bPieces[5].pos = { x: 5, y: 1 };
  bPieces[6].pos = { x: 6, y: 1 };
  bPieces[7].pos = { x: 7, y: 1 };
  bPieces[8].pos = { x: 0, y: 0 };
  bPieces[9].pos = { x: 7, y: 0 };
  bPieces[10].pos = { x: 1, y: 0 };
  bPieces[11].pos = { x: 6, y: 0 };
  bPieces[12].pos = { x: 2, y: 0 };
  bPieces[13].pos = { x: 5, y: 0 };
  bPieces[14].pos = { x: 3, y: 0 };
  bPieces[15].pos = { x: 4, y: 0 };

}

function drawPieces() {
  // Drawing all pieces on the board
  for (let i = 0; i < wPieces.length; i++) {
    drawPiece(wPieces[i]);
  }

  for (let i = 0; i < bPieces.length; i++) {
    drawPiece(bPieces[i]);
  }
}

function drawPiece(piece) {
  let imgPath = `./img/${piece.color}-${piece.type}.png`;
  let pieceImgElement = posToSqaure(piece.pos).getElementsByTagName('img')[0];
  pieceImgElement.src = imgPath;
  pieceImgElement.alt = '';
}

function clearSquare(pos) {
  let pieceImgElement = posToSqaure(pos).getElementsByTagName('img')[0];
  pieceImgElement.src = '';
}

let prevSquare;
let prevValidMoves;
function selectSquare(e) {
  let currentPos = { x: parseInt(e.id[3]), y: parseInt(e.id[5])};
  e.classList.add('selected-square');

  if (prevSquare) {
    prevSquare.classList.remove('selected-square');
  }
  prevSquare = e;

  let validMoves = [];
  for (let i = 0; i < wPieces.length; i++) {
    let piece = wPieces[i];
    if (piece.isPosEqual(currentPos)) {
      validMoves = piece.validMoves();
    }
  }

  for (let i = 0; i < bPieces.length; i++) {
    let piece = bPieces[i];
    if (piece.isPosEqual(currentPos)) {
      validMoves = piece.validMoves();
    }
  }

  for (let i = 0; i < validMoves.length; i++) {
    validMoves[i].classList.add('valid-move-square');
  }

  if (prevValidMoves) {
    for (let i = 0; i < prevValidMoves.length; i++) {
      prevValidMoves[i].classList.remove('valid-move-square');
    }
  }
  prevValidMoves = validMoves;
}

function getPosState(pos, color) {
  if (pos.x > boardSize - 1 || pos.x < 0 || pos.y > boardSize - 1 || pos.y < 0) {
    return 'OUT-OF-BOUNDS';
  }
  for (let i = 0; i < wPieces.length; i++) {
    if (wPieces[i].isPosEqual(pos)) {
      return color === 'w' ? 'friendly' : 'enemy';
    }
  }
  for (let i = 0; i < bPieces.length; i++) {
    if (bPieces[i].isPosEqual(pos)) {
      return color === 'b' ? 'friendly' : 'enemy';
    }
  }
  return 'free';
}

function posToSqaure(pos) {
  return document.getElementById(`pos${pos.x}-${pos.y}`);
}
