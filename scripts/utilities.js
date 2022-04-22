// Function that takes a pos object { x: , y: } and returns the <td> element in that position.
function posToSqaure(pos) {
  return document.getElementById(`pos${pos.x}-${pos.y}`);
}

// Function that takes a <td> element and returns the position of it as a pos object { x: , y: }.
function squareToPos(square) {
  return { x: parseInt(square.id[3]), y: parseInt(square.id[5])};
}

// Function that gets a pos object { x: , y: } and mirror it to the other side of the board (along the vertical axis).
function mirrorPosVertically(pos) {
  return { x: pos.x, y: (gameManager.boardData.boardSize - 1) - pos.y};
}

// Function that gets two position objects { x: , y: } and returns weather they are equal.
function isPosEqual(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

// Function that adds two position object and return their sum.
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

// Function that subtract two position object and return their difference.
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

// Function that get a pos object and a factor and multiply the pos by the factor and returns it.
function multPos(pos, factor) {
  return { x: pos.x * factor, y: pos.y * factor };
}

// Function that gets a pos object and an angle and returns a rotated version of the pos (works only for 90 degree incrementation).
function rotatePos(pos, angle) {
  let rotations = angle / 90;
  for (let i = 0; i < rotations; i++) {
    let tempPos = { x: pos.y, y: -pos.x };
    pos = tempPos;
  }
  return pos;
}

// Function that gets a color TeamColor value and returns the king of that color.
function getKing(color) {
  let pieces = color === TeamColor.WHITE ? boardData.wPieces : boardData.bPieces;
  for (let piece of pieces) {
    if (piece.type === King.TYPE) {
      return piece;
    }
  }
}

// Function that gets a color TeamColor value and returns the oppisite TeamColor (WHITE -> BLACK and vice-versa).
function flipColor(color) {
  return color === TeamColor.WHITE ? TeamColor.BLACK : TeamColor.WHITE;
}
