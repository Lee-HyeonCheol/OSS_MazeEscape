const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 40;  // 한 칸 크기
const maze = [  // 1은 벽, 0은 길
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1]
];

let player = { x: 1, y: 1 };  // 시작 위치

canvas.width = maze[0].length * tileSize;
canvas.height = maze.length * tileSize;

// 미로 그리기
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    // 플레이어 그리기
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(player.x * tileSize + tileSize / 2, player.y * tileSize + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
    ctx.fill();
}

// 키 입력 처리
document.addEventListener("keydown", (event) => {
    let newX = player.x;
    let newY = player.y;

    if (event.key === "ArrowUp") newY--;
    if (event.key === "ArrowDown") newY++;
    if (event.key === "ArrowLeft") newX--;
    if (event.key === "ArrowRight") newX++;

    // 이동 가능하면 업데이트
    if (maze[newY] && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
    }

    drawMaze();
});

drawMaze();
