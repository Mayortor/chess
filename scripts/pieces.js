class Piece {
  constructor(color, type, pos = { x: 0, y: 0 }) {
    this.color = color;
    this.type = type;
    this.pos = pos;
  }



  moveTo(pos) {
    clearSquare(this.pos);
    this.pos = pos;
    drawPiece(this);
    board[pos.y][pos.x] = this;
  }
}

class Pawn extends Piece {
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'pawn', pos);
    this.isFirstMove = true;
  }

  validMoves() {
    let possibleMoves = [];
    const steps = this.isFirstMove ? 2 : 1;

    for (let i = 0; i < steps; i++) {
      let checkPos = this.color === TeamColor.WHITE ? { x: this.pos.x, y: this.pos.y - i - 1 } : { x: this.pos.x, y: this.pos.y + i + 1 };
      if (getPosState(checkPos, this.color) === State.EMPTY) {
        possibleMoves.push(posToSqaure(checkPos));
      } else if (getPosState(checkPos, this.color) === State.ENEMY) {
        possibleMoves.push(posToSqaure(checkPos));
        break;
      } else {
        return possibleMoves;
      }
    }

    this.isFirstMove = false;
    return possibleMoves;
  }
}

class Rook extends Piece {
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'rook', pos);
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
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'knight', pos);
    this.isFirstMove = true;
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
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'bishop', pos);
    this.isFirstMove = true;
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
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'queen', pos);
    this.isFirstMove = true;
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
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'king', pos);
    this.isFirstMove = true;
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

    return possibleMoves;
  }
}
