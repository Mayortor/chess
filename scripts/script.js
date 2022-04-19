
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
  {type: Pawn.TYPE, pos: { x: 0, y: 1 }},
  {type: Pawn.TYPE, pos: { x: 1, y: 1 }},
  {type: Pawn.TYPE, pos: { x: 2, y: 1 }},
  {type: Pawn.TYPE, pos: { x: 3, y: 1 }},
  {type: Pawn.TYPE, pos: { x: 4, y: 1 }},
  {type: Pawn.TYPE, pos: { x: 5, y: 1 }},
  {type: Pawn.TYPE, pos: { x: 6, y: 1 }},
  {type: Pawn.TYPE, pos: { x: 7, y: 1 }},
  {type: Rook.TYPE, pos: { x: 0, y: 0 }},
  {type: Knight.TYPE, pos: { x: 1, y: 0 }},
  {type: Bishop.TYPE, pos: { x: 2, y: 0 }},
  {type: Queen.TYPE, pos: { x: 3, y: 0 }},
  {type: King.TYPE, pos: { x: 4, y: 0 }},
  {type: Bishop.TYPE, pos: { x: 5, y: 0 }},
  {type: Knight.TYPE, pos: { x: 6, y: 0 }},
  {type: Rook.TYPE, pos: { x: 7, y: 0 }}
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

let enPassant;
let popupArgs;
let turn = TeamColor.WHITE;

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
  let piece;
  switch (type) {
    case Pawn.TYPE:
      piece = new Pawn(color, pos);
      break;
    case Rook.TYPE:
      piece = new Rook(color, pos);
      break;
    case Knight.TYPE:
      piece = new Knight(color, pos);
      break;
    case Bishop.TYPE:
      piece = new Bishop(color, pos);
      break;
    case Queen.TYPE:
      piece = new Queen(color, pos);
      break;
    case King.TYPE:
      piece = new King(color, pos);
      break;
  }
  board[pos.y][pos.x] = piece;
  (color === TeamColor.WHITE) ? wPieces.push(piece) : bPieces.push(piece);
  drawPiece(piece)
  return piece;
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

function captureSquare(pos) {
  let piece = board[pos.y][pos.x];
  if (piece) {
    piece.color === TeamColor.WHITE ? wPieces.splice(wPieces.indexOf(piece), 1) : bPieces.splice(bPieces.indexOf(piece), 1);
  }
  board[pos.y][pos.x] = State.EMPTY;
}

let prevSquare;
let prevValidMoves;
function selectSquare(e) {
  let currentPos = squareToPos(e);
  let isValidMove = false;
  if (prevSquare) {
    prevSquare.classList.remove('selected-square');
  }

  if (prevValidMoves) {
    for (let i = 0; i < prevValidMoves.length; i++) {
      prevValidMoves[i].classList.remove('valid-move-square');
      isValidMove = (isPosEqual(squareToPos(prevValidMoves[i]), currentPos)) || isValidMove;
    }
  }

  if (isValidMove) {
    let piecePos = squareToPos(prevSquare);
    board[piecePos.y][piecePos.x].moveTo(currentPos);
    prevSquare = undefined;
    prevValidMoves = undefined;
  } else {
    e.classList.add('selected-square');
    prevSquare = e;

    let piece = board[currentPos.y][currentPos.x];
    let validMoves;

    piece && piece.color === turn ? validMoves = piece.validMoves() : validMoves = [];

    for (let i = 0; i < validMoves.length; i++) {
      validMoves[i].classList.add('valid-move-square');
    }

    prevValidMoves = validMoves;
  }
}

function promotion(pos, color) {
  console.log('test');
  let popupWindow = document.getElementById((color === TeamColor.WHITE) ? 'w-popup' : 'b-popup' );
  popupArgs = {
    color: color,
    pos: pos
  };
  popupWindow.style.visibility = 'visible';
}

function promotionChoosen() {
  let type = $('input[name="promotion"]:checked');
  if (type) {
    captureSquare(popupArgs.pos);
    let newPiece = createPiece(type.val(), popupArgs.color, popupArgs.pos);
    let popupWindow = document.getElementById((popupArgs.color === TeamColor.WHITE) ? 'w-popup' : 'b-popup' );
    popupWindow.style.visibility = 'hidden';
    popupArgs = undefined;
  }
}

function getPosState(pos, color) {
  if (pos.x > boardSize - 1 || pos.x < 0 || pos.y > boardSize - 1 || pos.y < 0) {
    return State.OUT;
  }
  let square = board[pos.y][pos.x];
  return square !== State.EMPTY ? square.color == color ? State.FRIENDLY : State.ENEMY : State.EMPTY;
}

function posToSqaure(pos) {
  return document.getElementById(`pos${pos.x}-${pos.y}`);
}

function squareToPos(square) {
  return { x: parseInt(square.id[3]), y: parseInt(square.id[5])};
}

function mirrorPosVertically(pos) {
  return { x: pos.x, y: (boardSize - 1) - pos.y};
}

function isPosEqual(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addPos(pos1, pos2) {
  let pos = {...pos1};
  if (pos2.x) {
    pos.x += pos2.x;
  }
  if (pos2.y) {
    pos.y += pos2.y;
  }
  return pos;
}

function subPos(pos1, pos2) {
  let pos = {...pos1};
  if (pos2.x) {
    pos.x -= pos2.x;
  }
  if (pos2.y) {
    pos.y -= pos2.y;
  }
  return pos;
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
