let mazeData = [];
let playerX = 0;
let playerY = 0;
let size = 0;

let startTime = null;
let moveCount = 0;
let hasStarted = false;

function generateMaze() {
	hasStarted = false;
    size = document.getElementById('size').value;
    fetch(`/maze/create?size=${size}`)
        .then(response => response.json())
        .then(data => {
            mazeData = data;
            [playerX, playerY] = findStart(data);
            drawMaze();
        });
}

function findStart(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 2) return [i, j];
        }
    }
    return [0, 0];
}

function drawMaze() {
    const container = document.getElementById('mazeContainer');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${mazeData[0].length}, 25px)`;
    container.className = 'maze-grid';

    for (let i = 0; i < mazeData.length; i++) {
        for (let j = 0; j < mazeData[0].length; j++) {
            const div = document.createElement('div');
            div.classList.add('cell');

            const cell = mazeData[i][j];
            if (cell === 1) div.classList.add('wall');
            else if (cell === 0) div.classList.add('path');
            else if (cell === 2) div.classList.add('start');
            else if (cell === 3) div.classList.add('end');

            if (i === playerX && j === playerY) {
                div.classList.add('player');
            }

            container.appendChild(div);
        }
    }
}

document.addEventListener('keydown', e => {
    const direction = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1]
    }[e.key];

    if (!direction) return;

    const [dx, dy] = direction;
    const nx = playerX + dx;
    const ny = playerY + dy;

    if (nx >= 0 && ny >= 0 && nx < size && ny < size) {
        const next = mazeData[nx][ny];
        if (next === 0 || next === 3) {
            if (!hasStarted) {
                startTime = performance.now();
                moveCount = 0;
                hasStarted = true;
            }

            playerX = nx;
            playerY = ny;
            moveCount++;
            drawMaze();

            if (next === 3) {
                const elapsedTime = ((performance.now() - startTime) / 1000).toFixed(2);
                alert(`🏁 도착했습니다!\n⏱ 시간: ${elapsedTime}초\n🚶 이동 횟수: ${moveCount}회`);

                fetch("/result/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        mazeSize: size,
                        elapsedTime: parseFloat(elapsedTime),
                        moveCount: moveCount
                    })
                })
                .then(res => res.text())
                .then(msg => console.log(msg));
            }
        }
    }
});