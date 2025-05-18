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
let currentSimPath = [];
let currentSimIndex = 0;


function generateMaze() {

  if (simulationInterval) {
      stopSimulation();
  }
  hasStarted = false;
  hasEscaped = false;
  movePath = [];

  size = parseInt(document.getElementById('size').value, 10);

  // 시뮬레이션 관련 버튼 숨김
  const simButtons = document.querySelectorAll('button[id$="SimulationBtn"]');
  simButtons.forEach(btn => {
    btn.style.display = 'none';
    btn.disabled = true;
  });

  const stopBtn = document.getElementById('stopSimulationBtn');
  if (stopBtn) {
    stopBtn.style.display = 'none';
    stopBtn.disabled = true;
  }

  fetch(`/maze/create?size=${size}`)
    .then(response => response.json())
    .then(data => {
      mazeData = data.maze ?? data;  // maze 필드가 있으면 사용, 없으면 그대로
      [playerX, playerY] = findStart(mazeData);
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

      // 반드시 dataset에 x, y 추가
      div.dataset.x = i.toString();
      div.dataset.y = j.toString();

      container.appendChild(div);
    }
  }

  // 미로 그리기 후, 플레이어 위치에 표시
  updatePlayerPosition(null, null, playerX, playerY);
}



function updatePlayerPosition(prevX, prevY, nextX, nextY) {
  // 이전 위치에서 .player 제거
  if (prevX !== null && prevY !== null) {
    const prev = document.querySelector(`.cell[data-x="${prevX}"][data-y="${prevY}"]`);
    if (prev) prev.classList.remove('player');
  }

  // 새 위치에 .player 추가
  const next = document.querySelector(`.cell[data-x="${nextX}"][data-y="${nextY}"]`);
  if (next) next.classList.add('player');
  else console.warn('플레이어 위치 셀 없음:', nextX, nextY);
}

document.addEventListener('keydown', e => {
    if (hasEscaped || simulationInterval) return;

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

			const prevX = playerX;
			const prevY = playerY;

            playerX = nx;
            playerY = ny;
            movePath.push([playerX, playerY]);
            moveCount++;

            updatePlayerPosition(prevX, prevY, playerX, playerY);

            if (next === 3) {
                hasEscaped = true;
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

                const simButtons = document.querySelectorAll('button[id$="SimulationBtn"]');
                  simButtons.forEach(btn => {
                    btn.style.display = 'inline-block';
                    btn.disabled = false;
                  });

                showSimulationButtons();
            }
        }
    }
});


function showSimulationButtons() {
  const simButtons = [
    { id: 'userSimulationBtn', text: '사용자 시뮬레이션 보기', onClick: () => startSimulation('User') },
    { id: 'dfsSimulationBtn', text: 'DFS 시뮬레이션', onClick: () => startSimulation('DFS') },
    { id: 'bfsSimulationBtn', text: 'BFS 시뮬레이션', onClick: () => startSimulation('BFS') },
    { id: 'aStarSimulationBtn', text: 'A* 시뮬레이션', onClick: () => startSimulation('AStar') },
    { id: 'rightHandSimulationBtn', text: '오른손 법칙 시뮬레이션', onClick: () => startSimulation('RightHand') },
  ];

  simButtons.forEach(({ id, text, onClick }) => {
    let btn = document.getElementById(id);
    if (!btn) {
      btn = document.createElement('button');
      btn.id = id;
      btn.innerText = text;
      btn.onclick = onClick;
      document.body.appendChild(btn);
    }
    btn.style.display = 'inline-block';
    btn.disabled = false;
  });

  const stopBtnId = 'stopSimulationBtn';
  let stopBtn = document.getElementById(stopBtnId);
  if (!stopBtn) {
    stopBtn = document.createElement('button');
    stopBtn.id = stopBtnId;
    stopBtn.innerText = '시뮬레이션 종료';
    stopBtn.onclick = stopSimulation;
    document.body.appendChild(stopBtn);
  }
  stopBtn.style.display = 'none';
  stopBtn.disabled = true;
}


function clearPlayerMarker() {
  const prevPlayerCell = document.querySelector('.cell.player');
  if (prevPlayerCell) prevPlayerCell.classList.remove('player');
}


// 서버 기반 시뮬레이션 경로 가져오기 및 시뮬레이션 실행
function startSimulation(type) {
  if (simulationInterval) stopSimulation();
  clearPlayerMarker();

  document.querySelectorAll('button[id$="SimulationBtn"]').forEach(btn => {
    btn.disabled = false;
  });

  const btnId = type.toLowerCase() + 'SimulationBtn';
  const simBtn = document.getElementById(btnId);
  if (simBtn) simBtn.disabled = true;

  // User 경로는 클라이언트에서 기록한 movePath 사용
  if (type === 'User') {
    currentSimPath = movePath;
    runSimulation();
    return;
  }

  // 서버에 시뮬레이션 경로 요청
  fetch(`/simulation/${type.toLowerCase()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ maze: mazeData })
  })
  .then(res => res.json())
  .then(data => {
    // fullExploredPath: [ {x: 0, y:1}, ... ]
    currentSimPath = data.fullExploredPath.map(p => [p.x, p.y]);
    runSimulation();
  })
  .catch(err => {
    console.error("시뮬레이션 요청 실패:", err);
    alert("시뮬레이션 요청에 실패했습니다.");
  });
}

function runSimulation() {
  if (!currentSimPath || currentSimPath.length === 0) {
    alert("경로가 없습니다.");
    return;
  }

  currentSimPath = removeConsecutive(currentSimPath);
  currentSimIndex = 0;
  playerX = currentSimPath[0][0];
  playerY = currentSimPath[0][1];
  updatePlayerPosition(null, null, playerX, playerY);

  const stopBtn = document.getElementById('stopSimulationBtn');
  stopBtn.disabled = false;
  stopBtn.style.display = 'inline-block';

  simulationInterval = setInterval(() => {
    currentSimIndex++;
    if (currentSimIndex >= currentSimPath.length) {
      stopSimulation();
      alert("시뮬레이션 종료");
      return;
    }
    const [x, y] = currentSimPath[currentSimIndex];
    updatePlayerPosition(playerX, playerY, x, y);
    playerX = x;
    playerY = y;
  }, 300);
}


function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }

  document.querySelectorAll('button[id$="SimulationBtn"]').forEach(btn => {
    btn.disabled = false;
  });

  const stopBtn = document.getElementById('stopSimulationBtn');
  stopBtn.disabled = true;
  stopBtn.style.display = 'none';
}


function removeConsecutive(path) {
  if (!path || path.length === 0) return [];

  const newPath = [path[0]];

  for (let i = 1; i < path.length; i++) {
    const [prevX, prevY] = newPath[newPath.length - 1];
    const [currX, currY] = path[i];

    if (prevX !== currX || prevY !== currY) {
      newPath.push([currX, currY]);
    }
  }

  return newPath;
}
