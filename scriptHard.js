document.addEventListener("DOMContentLoaded", () => {
    const gameBox = document.querySelector(".gameBox");
    const rows = 16;
    const cols = 16;
    const mines = 40;
    
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
