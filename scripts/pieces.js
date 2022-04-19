class Piece {
  constructor(color, type, pos = { x: 0, y: 0 }) {
    this.color = color;
    this.type = type;
    this.pos = pos;
    this.isFirstMove = true;
  }

  moveTo(pos) {
    changeTurn();
    enPassant = undefined;
    this.isFirstMove = false;
    clearSquare(this.pos);
    captureSquare(pos);
    this.pos = pos;
    drawPiece(this);
    board[pos.y][pos.x] = this;
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
      if (getPosState(checkPos, this.color) === State.EMPTY) {
        possibleMoves.push(posToSqaure(checkPos));
      } else {
        break;
      }
    }

    if (enPassant) {
      if (this.pos.y === enPassant.pos.y) {
        let checkPoses = [];
        if (this.pos.x + 1 === enPassant.pos.x || this.pos.x - 1 === enPassant.pos.x) {
          checkPoses = [{ x: enPassant.pos.x, y: this.pos.y + 1 }, { x: enPassant.pos.x, y: this.pos.y - 1 }];
        }
        for (let i = 0; i < checkPoses.length; i++) {
          if (getPosState(checkPoses[i], this.color) === State.EMPTY) {
            possibleMoves.push(posToSqaure(checkPoses[i]));
          }
        }
      }
    }

    return possibleMoves;
  }

  moveTo(pos) {
    changeTurn();
    this.isFirstMove = false;
    if (enPassant && pos.x !== this.pos.x) {
      if (pos.y < this.pos.y) {
        captureSquare({ x: pos.x, y: pos.y + 1});
        clearSquare({ x: pos.x, y: pos.y + 1});
      } else if (pos.y > this.pos.y) {
        captureSquare({ x: pos.x, y: pos.y - 1})
        clearSquare({ x: pos.x, y: pos.y - 1});
      }
    }
    enPassant = undefined;
    if (Math.abs(pos.y - this.pos.y) === 2) enPassant = this;
    clearSquare(this.pos);
    captureSquare(pos);
    this.pos = pos;
    drawPiece(this);
    board[pos.y][pos.x] = this;

    if (pos.y === 0 && this.color === TeamColor.WHITE || pos.y === boardSize - 1 && this.color === TeamColor.BLACK) {
      promotion(pos, this.color);
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
    const steps = boardSize - 1;
    let offset = { x: 1, y: 0 }

    for (let i = 0; i < 4; i++) {
      let checkPos = {...this.pos};
      offset = rotatePos(offset, 90);

      for (let j = 0; j < boardSize - 1; j++) {
        checkPos = addPos(checkPos, offset);
        if (getPosState(checkPos, this.color) === State.EMPTY) {
          possibleMoves.push(posToSqaure(checkPos));
        } else if (getPosState(checkPos, this.color) === State.ENEMY) {
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
        if (getPosState(checkPos, this.color) === State.EMPTY) {
          possibleMoves.push(posToSqaure(checkPos));
        } else if (getPosState(checkPos, this.color) === State.ENEMY) {
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
    const steps = boardSize - 1;
    let offset = { x: 1, y: 1 }

    for (let i = 0; i < 4; i++) {
      let checkPos = {...this.pos};
      offset = rotatePos(offset, 90);

      for (let j = 0; j < boardSize - 1; j++) {
        checkPos = addPos(checkPos, offset);
        if (getPosState(checkPos, this.color) === State.EMPTY) {
          possibleMoves.push(posToSqaure(checkPos));
        } else if (getPosState(checkPos, this.color) === State.ENEMY) {
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
    const steps = boardSize - 1;
    let offsets = [{ x: 1, y: 0 }, { x: 1, y: 1 }];

    for (let k = 0; k < offsets.length; k++) {
      for (let i = 0; i < 4; i++) {
        let checkPos = {...this.pos};
        offsets[k] = rotatePos(offsets[k], 90);

        for (let j = 0; j < boardSize - 1; j++) {
          checkPos = addPos(checkPos, offsets[k]);
          if (getPosState(checkPos, this.color) === State.EMPTY) {
            possibleMoves.push(posToSqaure(checkPos));
          } else if (getPosState(checkPos, this.color) === State.ENEMY) {
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
        if (getPosState(checkPos, this.color) === State.EMPTY) {
          possibleMoves.push(posToSqaure(checkPos));
        } else if (getPosState(checkPos, this.color) === State.ENEMY) {
          possibleMoves.push(posToSqaure(checkPos));
        }
      }
    }

    if (this.isFirstMove) {
      let maybeRooks = [board[this.pos.y][0], board[this.pos.y][boardSize - 1]];
      for (let i = 0; i < maybeRooks.length; i++) {
        if (maybeRooks[i]) {
          if (maybeRooks[i].type === Rook.TYPE && maybeRooks[i].isFirstMove) {
            let clear = true;
            for (let j = Math.min(maybeRooks[i].pos.x, this.pos.x) + 1; j < Math.max(maybeRooks[i].pos.x, this.pos.x); j++) {
              (getPosState({ x: j, y: this.pos.y }) !== State.EMPTY) ? clear = false : '';
            }
            let xOffset = maybeRooks[i].pos.x === 0 ? -2 : 2;
            clear ? possibleMoves.push(posToSqaure({ x: this.pos.x + xOffset, y: this.pos.y })) : '';
          }
        }
      }
    }
    return possibleMoves;
  }

  moveTo(pos) {
    changeTurn();
    enPassant = undefined;
    this.isFirstMove = false;
    if (Math.abs(this.pos.x - pos.x) === 2) {
      if (pos.x === 6) {
        board[pos.y][boardSize - 1].moveTo({ x: pos.x - 1, y: pos.y });
      } else {
        board[pos.y][0].moveTo({ x: pos.x + 1, y: pos.y });
      }
    }
    clearSquare(this.pos);
    captureSquare(pos);
    this.pos = pos;
    drawPiece(this);
    board[pos.y][pos.x] = this;
  }
}
