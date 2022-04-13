
const boardSize = 8;
window.addEventListener('load', createBoard);

function createBoard() {
  let table = document.createElement('table');

  for (let y = 0; y < boardSize; y++) {
    let row = document.createElement('tr');
    for (let x = 0; x < boardSize; x++) {
      let square = document.createElement('td');
      if ((x + y) % 2 === 0) {
        square.classList.toggle('white-square');
      } else {
        square.classList.toggle('black-square');
      }
      row.appendChild(square);
    }
    table.appendChild(row);
  }

  document.body.appendChild(table);
}
