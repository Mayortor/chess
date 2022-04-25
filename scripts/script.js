// Defining board size;
const boardSize = 8;

const SquareState = {
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

let boardData;
let gameManager;

// Setting 'load' event
window.addEventListener('load', initializeBoard);

function initializeBoard() {
  gameManager = new GameManager(boardData);
  gameManager.boardData.createBoard();
  boardData = gameManager.boardData;
}
