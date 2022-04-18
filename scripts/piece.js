class Piece {
  constructor(color, type, pos = { x: 0, y: 0 }) {
    this.color = color;
    this.type = type;
    this.pos = pos;
  }

  isPosEqual(pos) {
    return this.pos.x === pos.x && this.pos.y === pos.y;
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
    if (this.color = 'w') {
      for (let i = 0; i < steps; i++) {
        let checkPos = { x: this.pos.x, y: this.pos.y - i - 1 };
        if (freePos(checkPos)) {
          possibleMoves.push(posToSqaure(checkPos));
        }
      }
    }
    return possibleMoves;
  }
}

class Rook extends Piece {
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'rook', pos);
    this.isFirstMove = true;
  }

  validMoves() {
    return [];
  }
}

class Knight extends Piece {
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'knight', pos);
    this.isFirstMove = true;
  }

  validMoves() {
    return [];
  }
}

class Bishop extends Piece {
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'bishop', pos);
    this.isFirstMove = true;
  }

  validMoves() {
    return [];
  }
}

class Queen extends Piece {
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'queen', pos);
    this.isFirstMove = true;
  }

  validMoves() {
    return [];
  }
}

class King extends Piece {
  constructor(color, pos = { x: 0, y: 0 }) {
    super(color, 'king', pos);
    this.isFirstMove = true;
  }

  validMoves() {
    return [];
  }
}
