let board = [];
let revealedCount = 0;
let totalCells = 0;
let gameOver = false;
let flagsLeft = 0;

function startGame(level) {
    // Ukrywamy przyciski wyboru poziomu i tytuł
    document.querySelector('.buttons').classList.add('hidden');
    document.querySelector('.title').classList.add('hidden');

    // Pokazujemy planszę, licznik flag i przycisk restartu
    document.querySelector('.gameBox').classList.remove('hidden');
    document.getElementById('flagsCounter').classList.remove('hidden');
    document.getElementById('restartBtn').classList.remove('hidden');

    // Zmieniamy tło w zależności od poziomu
    if (level === 'easy') {
        document.body.style.backgroundColor = "#2d6a4f"; // zielony
    } else if (level === 'medium') {
        document.body.style.backgroundColor = "#b5838d"; // różowy
    } else if (level === 'hard') {
        document.body.style.backgroundColor = "#9b2226"; // czerwony
    }

    const gameBox = document.querySelector('.gameBox');
    gameBox.innerHTML = ''; // Wyczyść planszę
    gameOver = false;
    revealedCount = 0;

    let rows, cols, mines;
    
    if (level === 'easy') {
        rows = 8; cols = 8; mines = 10;
    } else if (level === 'medium') {
        rows = 12; cols = 12; mines = 25;
    } else if (level === 'hard') {
        rows = 16; cols = 16; mines = 40;
    }

    totalCells = rows * cols - mines;
    flagsLeft = mines;
    updateFlagsCounter();
    generateBoard(rows, cols, mines);
}

function generateBoard(rows, cols, mines) {
    const gameBox = document.querySelector('.gameBox');
    gameBox.style.display = "grid";
    gameBox.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    gameBox.style.gridTemplateRows = `repeat(${rows}, 40px)`;

    board = Array(rows).fill().map(() => Array(cols).fill(0));

    // Umieszczanie min
    let mineCount = 0;
    while (mineCount < mines) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (board[r][c] !== 'X') {
            board[r][c] = 'X';
            mineCount++;
        }
    }

    // Obliczanie liczb wokół min
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 'X') continue;
            board[r][c] = countMines(r, c, rows, cols);
        }
    }

    // Tworzenie siatki
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => revealCell(r, c));
            cell.addEventListener('contextmenu', (e) => toggleFlag(e, r, c));
            gameBox.appendChild(cell);
        }
    }
}

function countMines(row, col, rows, cols) {
    let count = 0;
    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    for (let [dr, dc] of directions) {
        let nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === 'X') {
            count++;
        }
    }
    return count;
}

function revealCell(row, col) {
    if (gameOver) return;
    
    let cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (!cell || cell.classList.contains('revealed') || cell.classList.contains('flagged')) return;

    cell.classList.add('revealed');
    let value = board[row][col];

    if (value === 'X') {
        cell.innerHTML = '💣';
        cell.style.backgroundColor = 'red';
        endGame(false);
    } else {
        cell.innerHTML = value === 0 ? '' : value;
        cell.style.backgroundColor = '#bbb';
        revealedCount++;

        // Jeśli wartość to 0, odkrywamy sąsiadów
        if (value === 0) {
            revealNeighbors(row, col);
        }

        // Sprawdzamy, czy gracz wygrał
        if (revealedCount === totalCells) {
            endGame(true);
        }
    }
}

function revealNeighbors(row, col) {
    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let [dr, dc] of directions) {
        let nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
            let neighbor = document.querySelector(`[data-row='${nr}'][data-col='${nc}']`);
            if (neighbor && !neighbor.classList.contains('revealed')) {
                revealCell(nr, nc);
            }
        }
    }
}


function toggleFlag(event, row, col) {
    event.preventDefault();
    if (gameOver) return;
    
    let cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (cell.classList.contains('revealed')) return;

    if (cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
        cell.innerHTML = '';
        flagsLeft++;
    } else if (flagsLeft > 0) {
        cell.classList.add('flagged');
        cell.innerHTML = '🚩';
        flagsLeft--;
    }

    updateFlagsCounter();
}

function endGame(win) {
    gameOver = true;
    alert(win ? "🎉 Wygrałeś!" : "💥 Game Over!");
}

function updateFlagsCounter() {
    document.getElementById('flagsCounter').innerText = `🚩 Pozostałe flagi: ${flagsLeft}`;
}

function restartGame() {
    location.reload();
}
