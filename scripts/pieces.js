class Piece {
  constructor(color, type, pos = { x: 0, y: 0 }) {
    this.color = color;
    this.type = type;
    this.pos = pos;
    this.isFirstMove = true;
  }

  moveTo(pos, isVirtual) {
    if (!isVirtual) {
      gameManager.changeTurn();
      gameManager.enPassant = undefined;
    }
    boardData.clearSquare(this.pos);
    boardData.captureSquare(pos);
    this.pos = pos;
    boardData.board[pos.y][pos.x] = this;
    boardData.drawPiece(this);
    if (!isVirtual) {
      this.isFirstMove = false;
      gameManager.checkForChecks();
    }
  }
}

class Pawn extends Piece {
  static TYPE = 'pawn';
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, Pawn.TYPE, pos);
    this.isFirstMove = true;
  }

  validMoves() {
    let possibleMoves = [];
    const steps = this.isFirstMove ? 2 : 1;

    for (let i = 0; i < steps; i++) {
      let checkPos = this.color === TeamColor.WHITE ? { x: this.pos.x, y: this.pos.y - i - 1 } : { x: this.pos.x, y: this.pos.y + i + 1 };
      if (boardData.getPosState(checkPos, this.color) === SquareState.EMPTY) {
        possibleMoves.push(posToSqaure(checkPos));
      } else {
        break;
      }
    }

    let offset = { x: 1, y: 1 };
    for (let i = 0; i < 4; i++) {
      let checkPos = {...this.pos};
      offset = rotatePos(offset, 90);
      checkPos = addPos(checkPos, offset);
      boardData.getPosState(checkPos, this.color) === SquareState.ENEMY ? possibleMoves.push(posToSqaure(checkPos)) : '';
    }

    if (gameManager.enPassant) {
      if (this.pos.y === gameManager.enPassant.pos.y) {
        let checkPoses = [];
        if (this.pos.x + 1 === gameManager.enPassant.pos.x || this.pos.x - 1 === gameManager.enPassant.pos.x) {
          checkPoses = [{ x: gameManager.enPassant.pos.x, y: this.pos.y + 1 }, { x: gameManager.enPassant.pos.x, y: this.pos.y - 1 }];
        }
        for (let i = 0; i < checkPoses.length; i++) {
          if (boardData.getPosState(checkPoses[i], this.color) === SquareState.EMPTY) {
            possibleMoves.push(posToSqaure(checkPoses[i]));
          }
        }
      }
    }

    return possibleMoves;
  }

  moveTo(pos, isVirtual) {
    if (gameManager.enPassant && pos.x !== this.pos.x) {
      if (pos.y < this.pos.y) {
        boardData.captureSquare({ x: pos.x, y: pos.y + 1});
        boardData.clearSquare({ x: pos.x, y: pos.y + 1});
      } else if (pos.y > this.pos.y) {
        boardData.captureSquare({ x: pos.x, y: pos.y - 1})
        boardData.clearSquare({ x: pos.x, y: pos.y - 1});
      }
    }
    let prevPos = {...this.pos};
    super.moveTo(pos, isVirtual);
    if (Math.abs(pos.y - prevPos.y) === 2) gameManager.enPassant = this;

    if (!isVirtual) {
      if (pos.y === 0 && this.color === TeamColor.WHITE || pos.y === boardData.boardSize - 1 && this.color === TeamColor.BLACK) {
        gameManager.promotion(pos, this.color);
      }
    }
  }
}

class Rook extends Piece {
  static TYPE = 'rook';
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, Rook.TYPE, pos);
    this.isFirstMove = true;
  }

  validMoves() {
    let possibleMoves = [];
    const steps = boardData.boardSize - 1;
    let offset = { x: 1, y: 0 }

    for (let i = 0; i < 4; i++) {
      let checkPos = {...this.pos};
      offset = rotatePos(offset, 90);

      for (let j = 0; j < boardData.boardSize - 1; j++) {
        checkPos = addPos(checkPos, offset);
        if (boardData.getPosState(checkPos, this.color) === SquareState.EMPTY) {
          possibleMoves.push(posToSqaure(checkPos));
        } else if (boardData.getPosState(checkPos, this.color) === SquareState.ENEMY) {
          possibleMoves.push(posToSqaure(checkPos));
          break;
        } else {
          break;
        }
      }
    }

    return possibleMoves;
  }
}

class Knight extends Piece {
  static TYPE = 'knight';
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, Knight.TYPE, pos);
  }

  validMoves() {
    let possibleMoves = [];
    let offsets = [{ x: 1, y: 2 }, { x: 2, y: 1 }];

    for (let i = 0; i < 4; i++) {
      offsets = offsets.map(pos => rotatePos(pos, 90));
      for (let j = 0; j < offsets.length; j++) {
        let checkPos = {...this.pos};
        checkPos = addPos(checkPos, offsets[j]);
        if (boardData.getPosState(checkPos, this.color) === SquareState.EMPTY) {
          possibleMoves.push(posToSqaure(checkPos));
        } else if (boardData.getPosState(checkPos, this.color) === SquareState.ENEMY) {
          possibleMoves.push(posToSqaure(checkPos));
        }
      }
    }
    return possibleMoves;
  }
}

class Bishop extends Piece {
  static TYPE = 'bishop';
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, Bishop.TYPE, pos);
  }

  validMoves() {
    let possibleMoves = [];
    const steps = boardData.boardSize - 1;
    let offset = { x: 1, y: 1 }

    for (let i = 0; i < 4; i++) {
      let checkPos = {...this.pos};
      offset = rotatePos(offset, 90);

      for (let j = 0; j < boardData.boardSize - 1; j++) {
        checkPos = addPos(checkPos, offset);
        if (boardData.getPosState(checkPos, this.color) === SquareState.EMPTY) {
          possibleMoves.push(posToSqaure(checkPos));
        } else if (boardData.getPosState(checkPos, this.color) === SquareState.ENEMY) {
          possibleMoves.push(posToSqaure(checkPos));
          break;
        } else {
          break;
        }
      }
    }

    return possibleMoves;
  }
}

class Queen extends Piece {
  static TYPE = 'queen';
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, Queen.TYPE, pos);
  }

  validMoves() {
    let possibleMoves = [];
    const steps = boardData.boardSize - 1;
    let offsets = [{ x: 1, y: 0 }, { x: 1, y: 1 }];

    for (let k = 0; k < offsets.length; k++) {
      for (let i = 0; i < 4; i++) {
        let checkPos = {...this.pos};
        offsets[k] = rotatePos(offsets[k], 90);

        for (let j = 0; j < boardData.boardSize - 1; j++) {
          checkPos = addPos(checkPos, offsets[k]);
          if (boardData.getPosState(checkPos, this.color) === SquareState.EMPTY) {
            possibleMoves.push(posToSqaure(checkPos));
          } else if (boardData.getPosState(checkPos, this.color) === SquareState.ENEMY) {
            possibleMoves.push(posToSqaure(checkPos));
            break;
          } else {
            break;
          }
        }
      }
    }
    return possibleMoves;
  }
}

class King extends Piece {
  static TYPE = 'king';
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'king', pos);
  }

  validMoves() {
    let possibleMoves = [];
    let offsets = [{ x: 1, y: 0 }, { x: 1, y: 1 }];

    for (let i = 0; i < 4; i++) {
      offsets = offsets.map(pos => rotatePos(pos, 90));
      for (let j = 0; j < offsets.length; j++) {
        let checkPos = {...this.pos};
        checkPos = addPos(checkPos, offsets[j]);
        if (boardData.getPosState(checkPos, this.color) === SquareState.EMPTY) {
          possibleMoves.push(posToSqaure(checkPos));
        } else if (boardData.getPosState(checkPos, this.color) === SquareState.ENEMY) {
          possibleMoves.push(posToSqaure(checkPos));
        }
      }
    }

    if (this.isFirstMove) {
      let maybeRooks = [boardData.board[this.pos.y][0], boardData.board[this.pos.y][boardData.boardSize - 1]];
      for (let i = 0; i < maybeRooks.length; i++) {
        if (maybeRooks[i]) {
          if (maybeRooks[i].type === Rook.TYPE && maybeRooks[i].isFirstMove) {
            let clear = true;
            for (let j = Math.min(maybeRooks[i].pos.x, this.pos.x) + 1; j < Math.max(maybeRooks[i].pos.x, this.pos.x); j++) {
              (boardData.getPosState({ x: j, y: this.pos.y }) !== SquareState.EMPTY) ? clear = false : '';
            }
            let xOffset = maybeRooks[i].pos.x === 0 ? -2 : 2;
            clear ? possibleMoves.push(posToSqaure({ x: this.pos.x + xOffset, y: this.pos.y })) : '';
          }
        }
      }
    }
    return possibleMoves;
  }

  moveTo(pos, isVirtual) {
    if (Math.abs(this.pos.x - pos.x) === 2) {
      if (isVirtual) {
        if (this.pos.x === 6) {
          boardData.board[pos.y][5].moveTo({ x: boardData.boardSize - 1, y: pos.y }, isVirtual);
        } else if (this.pos.x === 2) {
          boardData.board[pos.y][3].moveTo({ x: 0, y: pos.y }, isVirtual);
        }
      }

      if (pos.x === 6) {
        boardData.board[pos.y][boardData.boardSize - 1].moveTo({ x: pos.x - 1, y: pos.y }, isVirtual);
      } else if (pos.x === 2) {
        boardData.board[pos.y][0].moveTo({ x: pos.x + 1, y: pos.y }, isVirtual);
      }
      gameManager.changeTurn();
    }
    super.moveTo(pos, isVirtual);
  }
}
