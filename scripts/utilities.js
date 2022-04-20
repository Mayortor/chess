function posToSqaure(pos) {
  return document.getElementById(`pos${pos.x}-${pos.y}`);
}

function squareToPos(square) {
  return { x: parseInt(square.id[3]), y: parseInt(square.id[5])};
}

function mirrorPosVertically(pos) {
  return { x: pos.x, y: (gameManager.boardData.boardSize - 1) - pos.y};
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

function getKing(color) {
  let pieces = color === TeamColor.WHITE ? boardData.wPieces : boardData.bPieces;
  for (let piece of pieces) {
    if (piece.type === King.TYPE) {
      return piece;
    }
  }
}

function flipColor(color) {
  return color === TeamColor.WHITE ? TeamColor.BLACK : TeamColor.WHITE;
}
