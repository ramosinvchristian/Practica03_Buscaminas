let board = [];
let boardSize = { rows: 5, cols: 5 };
let totalMines = 5;
let firstClick = true; // Variable para rastrear si es el primer clic

// Configuraciones de dificultad
const difficultySettings = {
    easy: { rows: 5, cols: 5, mines: 5 },
    medium: { rows: 8, cols: 8, mines: 10 },
    hard: { rows: 10, cols: 10, mines: 20 },
    hardcore: { rows: 12, cols: 12, mines: 30 },
    legend: { rows: 15, cols: 15, mines: 50 },
};

function toggleCustomInputs() {
    const difficultySelect = document.getElementById('difficulty');
    const customInputs = document.getElementById('custom-inputs');
    if (difficultySelect.value === 'custom') {
        customInputs.style.display = 'flex';
    } else {
        customInputs.style.display = 'none';
        const { rows, cols, mines } = difficultySettings[difficultySelect.value];
        document.getElementById('rows').value = rows;
        document.getElementById('cols').value = cols;
        document.getElementById('mines').value = mines;
    }
}

function startGame() {
    const difficultySelect = document.getElementById('difficulty').value;
    if (difficultySelect === 'custom') {
        boardSize.rows = parseInt(document.getElementById('rows').value);
        boardSize.cols = parseInt(document.getElementById('cols').value);
        totalMines = parseInt(document.getElementById('mines').value);
    } else {
        const { rows, cols, mines } = difficultySettings[difficultySelect];
        boardSize.rows = rows;
        boardSize.cols = cols;
        totalMines = mines;
    }

    if (boardSize.rows < 5 || boardSize.cols < 5) {
        alert('El tamaño mínimo del tablero es de 5 x 5.');
        return;
    }

    // Reiniciar la variable firstClick para un nuevo juego
    firstClick = true;

    initializeBoard();
    renderBoard();
}

function initializeBoard() {
    board = Array.from({ length: boardSize.rows }, () =>
        Array.from({ length: boardSize.cols }, () => ({
            isMine: false,
            revealed: false,
            flagged: false,
            adjacentMines: 0,
        }))
    );
}

function placeMines(excludeRow, excludeCol) {
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
        let row = Math.floor(Math.random() * boardSize.rows);
        let col = Math.floor(Math.random() * boardSize.cols);
        // Asegurarse de no colocar minas en la celda clicada inicialmente
        if (!board[row][col].isMine && !(row === excludeRow && col === excludeCol)) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
    calculateAdjacentMines();
}

function calculateAdjacentMines() {
    for (let row = 0; row < boardSize.rows; row++) {
        for (let col = 0; col < boardSize.cols; col++) {
            if (!board[row][col].isMine) {
                board[row][col].adjacentMines = countAdjacentMines(row, col);
            }
        }
    }
}

function countAdjacentMines(row, col) {
    let mineCount = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i;
            let newCol = col + j;
            if (
                newRow >= 0 && newRow < boardSize.rows &&
                newCol >= 0 && newCol < boardSize.cols &&
                board[newRow][newCol].isMine
            ) {
                mineCount++;
            }
        }
    }
    return mineCount;
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${boardSize.cols}, 40px)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize.rows}, 40px)`;

    for (let row = 0; row < boardSize.rows; row++) {
        for (let col = 0; col < boardSize.cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick); // Maneja clic derecho

            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col].revealed || board[row][col].flagged) return; // No hacer nada si está revelado o marcado

    // Si es el primer clic, coloca minas y luego revela
    if (firstClick) {
        placeMines(row, col); // Coloca minas excluyendo la celda clicada
        firstClick = false; // Cambia a false después del primer clic
    }

    revealCell(row, col);
    checkWinCondition();
}

function handleCellRightClick(event) {
    event.preventDefault(); // Evita el menú contextual

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col].revealed) return; // No se puede marcar si ya está revelado

    board[row][col].flagged = !board[row][col].flagged; // Alterna el estado de la bandera

    const cellElement = event.target;
    if (board[row][col].flagged) {
        cellElement.classList.add('flag');
        cellElement.textContent = '🚩'; // Muestra la bandera
    } else {
        cellElement.classList.remove('flag');
        cellElement.textContent = ''; // Limpia el contenido
    }
}

function revealCell(row, col) {
    if (row < 0 || row >= boardSize.rows || col < 0 || col >= boardSize.cols || board[row][col].revealed) {
        return;
    }
    const cellElement = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    board[row][col].revealed = true;
    cellElement.classList.add('revealed');
    if (board[row][col].isMine) {
        cellElement.textContent = '💣';
        cellElement.style.backgroundColor = '#ef233c';
        document.getElementById('status').textContent = '¡Has perdido! Fin del juego.';
    } else {
        cellElement.textContent = board[row][col].adjacentMines > 0 ? board[row][col].adjacentMines : '';
        if (board[row][col].adjacentMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i !== 0 || j !== 0) {
                        revealCell(row + i, col + j);
                    }
                }
            }
        }
    }
}

function checkWinCondition() {
    const unrevealedCells = board.flat().filter(cell => !cell.revealed && !cell.isMine).length;
    if (unrevealedCells === 0) {
        document.getElementById('status').textContent = '¡Has ganado! Felicitaciones.';
    }
}
