let mazeData = [];
let playerX = 0;
let playerY = 0;
let size = 0;

let startTime = null;
let moveCount = 0;
let hasStarted = false;
let hasEscaped = false;
let movePath = []; // 이동 경로 기록용 배열
let simulationInterval = null;

function generateMaze() {
	hasStarted = false;
	hasEscaped = false;
	movePath = [];
    size = document.getElementById('size').value;

    const simBtn = document.getElementById('simulationBtn');
    if (simBtn) document.getElementById('simulationBtn').disabled = true;

    const stopBtn = document.getElementById('stopSimulationBtn');
    if (stopBtn) document.getElementById('stopSimulationBtn').disabled = true;

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
    if (hasEscaped) return;

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
        if (next === 0 || next === 2 || next === 3) {
            if (!hasStarted) {
                movePath.push([playerX, playerY]);
                startTime = performance.now();
                moveCount = 0;
                hasStarted = true;
            }

            playerX = nx;
            playerY = ny;
            movePath.push([playerX, playerY]);
            moveCount++;
            drawMaze();

            if (next === 3) {
                hasEscaped = true;
                const elapsedTime = ((performance.now() - startTime) / 1000).toFixed(2);
                alert(`🏁 도착했습니다!\n⏱ 시간: ${elapsedTime}초\n🚶 이동 횟수: ${moveCount}회`);

				// 기록 서버 저장
                saveEscapeRecord();

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

                showSimulationButton();
            }
        }
    }
});

function showSimulationButton() {
  const simBtn = document.getElementById('simulationBtn');
  const stopBtn = document.getElementById('stopSimulationBtn');

  if (!simBtn) {
    const btn = document.createElement('button');
    btn.id = 'simulationBtn';
    btn.innerText = '사용자 시뮬레이션 보기';
    btn.onclick = playSimulation;
    document.body.appendChild(btn);
  }

  if (stopBtn) {
    stopBtn.style.display = 'inline-block'; // 탈출 성공 시 종료 버튼 표시
  }
}



async function saveEscapeRecord() {
    const payload = {
        mazeSize: currentMazeSize,
        elapsedTime: elapsedTime,
        moveCount: movePath.length,
        movePath: movePath
    };

    const res = await fetch('/result/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    });

    if (!res.ok) {
        alert('기록 저장에 실패했습니다.');
    } else {
        alert('기록 저장 완료!');
    }
}

function playSimulation() {
  // 시뮬레이션 버튼 비활성화
  document.getElementById('simulationBtn').disabled = true;
  // 종료 버튼 활성화
  document.getElementById('stopSimulationBtn').style.display = 'inline-block';
  document.getElementById('stopSimulationBtn').disabled = false;

  if (!movePath || movePath.length === 0) return;

  let i = 0;
  playerX = movePath[0][0];
  playerY = movePath[0][1];
  drawMaze();

  simulationInterval = setInterval(() => {
    i++;
    if (i >= movePath.length) {
      stopSimulation();
      alert('시뮬레이션 종료');
      return;
    }
    playerX = movePath[i][0];
    playerY = movePath[i][1];
    drawMaze();
  }, 300);
}

function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  // 버튼 상태 초기화
  document.getElementById('simulationBtn').disabled = false;
  document.getElementById('stopSimulationBtn').disabled = true;
}