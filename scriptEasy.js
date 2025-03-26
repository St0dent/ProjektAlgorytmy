document.addEventListener("DOMContentLoaded", () => {
    const gameBox = document.querySelector(".gameBox");
    const rows = 8;
    const cols = 8;
    const mines = 10;
    
    function createBoard() {
        gameBox.innerHTML = "";
        gameBox.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
        gameBox.style.gridTemplateRows = `repeat(${rows}, 30px)`;
        
        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            gameBox.appendChild(cell);
        }
    }
    
    createBoard();
});
