
// Defining board size;
const boardSize = 8;

const State = {
  ENEMY: 'enemy',
  FRIENDLY: 'friendly',
  EMPTY: undefined,
  OUT: 'out'
}
const TeamColor = {
  WHITE: 'w',
  BLACK: 'b'
}
const piecesPosition = [
  {type: 'pawn', pos: { x: 0, y: 1 }},
  {type: 'pawn', pos: { x: 1, y: 1 }},
  {type: 'pawn', pos: { x: 2, y: 1 }},
  {type: 'pawn', pos: { x: 3, y: 1 }},
  {type: 'pawn', pos: { x: 4, y: 1 }},
  {type: 'pawn', pos: { x: 5, y: 1 }},
  {type: 'pawn', pos: { x: 6, y: 1 }},
  {type: 'pawn', pos: { x: 7, y: 1 }},
  {type: 'rook', pos: { x: 0, y: 0 }},
  {type: 'knight', pos: { x: 1, y: 0 }},
  {type: 'bishop', pos: { x: 2, y: 0 }},
  {type: 'queen', pos: { x: 3, y: 0 }},
  {type: 'king', pos: { x: 4, y: 0 }},
  {type: 'bishop', pos: { x: 5, y: 0 }},
  {type: 'knight', pos: { x: 6, y: 0 }},
  {type: 'rook', pos: { x: 7, y: 0 }}
]

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
let board;

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
  board = new Array();

  for (let i = 0; i < boardSize; i++) {
    board[i] = new Array();
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = State.EMPTY;
    }
  }

  for (let i = 0; i < piecesPosition.length; i++) {
    createPiece(piecesPosition[i].type, TeamColor.BLACK, piecesPosition[i].pos);
    createPiece(piecesPosition[i].type, TeamColor.WHITE, mirrorPosVertically(piecesPosition[i].pos));
  }
}

function createPiece(type, color, pos) {
  let piece
  switch (type) {
    case 'pawn':
      piece = new Pawn(color, pos);
      break;
    case 'rook':
      piece = new Rook(color, pos);
      break;
    case 'knight':
      piece = new Knight(color, pos);
      break;
    case 'bishop':
      piece = new Bishop(color, pos);
      break;
    case 'queen':
      piece = new Queen(color, pos);
      break;
    case 'king':
      piece = new King(color, pos);
      break;
  }
  board[pos.y][pos.x] = piece;
  (color === TeamColor.WHITE) ? wPieces.push(piece) : bPieces.push(piece);
  drawPiece(piece)
}

function drawPiece(piece) {
  let imgPath = `./img/${piece.color}-${piece.type}.png`;
  let pieceImgElement = posToSqaure(piece.pos).getElementsByTagName('img')[0];
  pieceImgElement.src = imgPath;
  pieceImgElement.alt = '';
}

function clearSquare(pos) {
  let pieceImgElement = posToSqaure(pos).getElementsByTagName('img')[0];
  board[pos.y][pos.x] = State.EMPTY;
  pieceImgElement.src = '';
}

let prevSquare;
let prevValidMoves;
function selectSquare(e) {
  if (prevSquare) {
    prevSquare.classList.remove('selected-square');
  }

  if (prevValidMoves) {
    for (let i = 0; i < prevValidMoves.length; i++) {
      prevValidMoves[i].classList.remove('valid-move-square');
    }
  }

  let currentPos = { x: parseInt(e.id[3]), y: parseInt(e.id[5])};
  e.classList.add('selected-square');

  prevSquare = e;

  let piece = board[currentPos.y][currentPos.x];
  let validMoves;
  piece ? validMoves = piece.validMoves() : validMoves = [];

  for (let i = 0; i < validMoves.length; i++) {
    validMoves[i].classList.add('valid-move-square');
  }

  prevValidMoves = validMoves;
}

function getPosState(pos, color) {
  if (pos.x > boardSize - 1 || pos.x < 0 || pos.y > boardSize - 1 || pos.y < 0) {
    return State.OUT;
  }
  let square = board[pos.y][pos.x]
  return square !== State.EMPTY ? square.color === color ? State.FRIENDLY : State.ENEMY : State.EMPTY;
}

function posToSqaure(pos) {
  return document.getElementById(`pos${pos.x}-${pos.y}`);
}

function mirrorPosVertically(pos) {
  return { x: pos.x, y: (boardSize - 1) - pos.y};
}

function addPos(pos1, pos2) {
  if (pos2.x) {
    pos1.x += pos2.x;
  }
  if (pos2.y) {
    pos1.y += pos2.y;
  }
  return pos1;
}

function subPos(pos1, pos2) {
  if (pos2.x) {
    pos1.x -= pos2.x;
  }
  if (pos2.y) {
    pos1.y -= pos2.y;
  }
  return pos1;
}

function multPos(pos, factor) {
  return { x: pos.x * factor, y: pos.y * factor };
}

function rotatePos(pos, angle) {
  let rotations = angle / 90;
  for (let i = 0; i < rotations; i++) {
    let tempPos = { x: pos.y, y: -pos.x };
    pos = tempPos;
  }
  return pos;
}
// Testing
function clearBoard() {
  wPieces = [];
  bPieces = [];
  for (let i = 0; i < boardSize; i++) {
    board[i] = new Array();
    for (let j = 0; j < boardSize; j++) {
      clearSquare({ x: j, y: i });
    }
  }
}
