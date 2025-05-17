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

                showSimulationButton();
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


function startSimulation(type) {
  if (simulationInterval) stopSimulation();
  clearPlayerMarker();

  document.querySelectorAll('button[id$="SimulationBtn"]').forEach(btn => {
    btn.disabled = false;
  });

  const btnId = type.toLowerCase() + 'SimulationBtn';
  const simBtn = document.getElementById(btnId);
  if (simBtn) simBtn.disabled = true;

  switch(type) {
    case 'User':
      currentSimPath = movePath;
      break;
    case 'DFS':
      currentSimPath = dfsSimulationPath(mazeData).fullExploredPath;
      break;
    case 'BFS':
      currentSimPath = bfsSimulationPath(mazeData).fullExploredPath;
      break;
    case 'AStar':
      currentSimPath = aStarSimulationPath(mazeData).fullExploredPath;
      break;
    case 'RightHand':
      currentSimPath = rightHandSimulationPath(mazeData);
      break;
    default:
      alert('알 수 없는 시뮬레이션 타입입니다.');
      return;
  }

  if (!currentSimPath || currentSimPath.length === 0) {
    alert('경로가 없습니다.');
    return;
  }

  const endPos = findEndPosition(mazeData);
  if (!endPos) {
    alert('도착 위치를 찾을 수 없습니다.');
    return;
  }
  const [endX, endY] = endPos;

  currentSimPath = removeConsecutive(currentSimPath, endX, endY);

  if (currentSimPath.length === 0) {
    alert('정리된 경로가 비어있습니다.');
    return;
  }

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
      alert('시뮬레이션 종료');
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


function findStartPosition(maze) {
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[0].length; j++) {
      if (maze[i][j] === 2) return [i, j];
    }
  }
  return null;
}

function findEndPosition(maze) {
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[0].length; j++) {
      if (maze[i][j] === 3) return [i, j];
    }
  }
  return null;
}

function removeConsecutive(path, endX, endY) {
  if (path.length === 0) return path;

  const newPath = [path[0]];

  for (let i = 1; i < path.length; i++) {
    const [prevX, prevY] = newPath[newPath.length - 1];
    const [currX, currY] = path[i];

    if (prevX !== currX || prevY !== currY) {
      newPath.push(path[i]);

      // 목적지 도달 시점에서 즉시 반환
      if (currX === endX && currY === endY) {
        return newPath;
      }
    }
  }

  return newPath;
}


function dfsSimulationPath(maze) {
  const [startX, startY] = findStartPosition(maze);
  const [endX, endY] = findEndPosition(maze);

  const visited = Array.from({ length: maze.length }, () => Array(maze[0].length).fill(false));
  const path = [];
  const exploredPath = [];

  let found = false;

  function dfs(x, y) {
    if (found) return;

    if (
      x < 0 || y < 0 ||
      x >= maze.length || y >= maze[0].length ||
      maze[x][y] === 1 || visited[x][y]
    ) return;

    visited[x][y] = true;

    // 방문하는 모든 셀 기록 (이동하는 경로)
    exploredPath.push([x, y]);
    path.push([x, y]);

    if (x === endX && y === endY) {
      found = true;
      return;
    }

    // 4방향 탐색
    dfs(x - 1, y);
    if (!found) exploredPath.push([x, y]); // 백트래킹 경로 기록

    dfs(x + 1, y);
    if (!found) exploredPath.push([x, y]);

    dfs(x, y - 1);
    if (!found) exploredPath.push([x, y]);

    dfs(x, y + 1);
    if (!found) exploredPath.push([x, y]);

    if (!found) path.pop();
  }

  dfs(startX, startY);

  return {
    finalPath: found ? path : [],
    fullExploredPath: exploredPath
  };
}


function bfsSimulationPath(maze) {
  const [startX, startY] = findStartPosition(maze);
  const [endX, endY] = findEndPosition(maze);
  const rows = maze.length;
  const cols = maze[0].length;

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
  const exploredPath = [];

  const queue = [];
  queue.push([startX, startY]);
  visited[startX][startY] = true;
  exploredPath.push([startX, startY]);

  let found = false;

  while (queue.length > 0) {
    const [x, y] = queue.shift();

	if (found) break;
    if (x === endX && y === endY) {
      found = true;
      break; // 목적지 도달하면 즉시 탐색 종료
    }

    const directions = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ];

    for (const [nx, ny] of directions) {
      if (
        nx >= 0 && ny >= 0 && nx < rows && ny < cols &&
        !visited[nx][ny] &&
        maze[nx][ny] !== 1 &&
        !found // 목적지 도달 전까지만 탐색
      ) {
        queue.push([nx, ny]);
        visited[nx][ny] = true;
        parent[nx][ny] = [x, y];
        exploredPath.push([nx, ny]);
      }
    }
  }

  // 최종 경로 복원
  const finalPath = [];
  if (found) {
    let cur = [endX, endY];
    while (cur) {
      finalPath.push(cur);
      cur = parent[cur[0]][cur[1]];
    }
    finalPath.reverse();
  }

  return {
    finalPath: finalPath,
    fullExploredPath: exploredPath
  };
}


function rightHandSimulationPath(maze) {
  const [startX, startY] = findStartPosition(maze);
  const [endX, endY] = findEndPosition(maze);
  const rows = maze.length;
  const cols = maze[0].length;

  // 방향: 0=북,1=동,2=남,3=서
  let dir = 0;
  let x = startX;
  let y = startY;

  const path = [[x, y]];
  const visited = new Set();

  function isPath(nx, ny) {
    return (
      nx >= 0 && ny >= 0 &&
      nx < rows && ny < cols &&
      maze[nx][ny] !== 1
    );
  }

  while (!(x === endX && y === endY)) {
    // 오른쪽 방향
    let rightDir = (dir + 1) % 4;
    let [rx, ry] = moveInDirection(x, y, rightDir);

    if (isPath(rx, ry)) {
      dir = rightDir;
      x = rx;
      y = ry;
      path.push([x, y]);
      continue;
    }

    // 앞으로
    let [fx, fy] = moveInDirection(x, y, dir);
    if (isPath(fx, fy)) {
      x = fx;
      y = fy;
      path.push([x, y]);
      continue;
    }

    // 왼쪽
    let leftDir = (dir + 3) % 4;
    let [lx, ly] = moveInDirection(x, y, leftDir);
    if (isPath(lx, ly)) {
      dir = leftDir;
      x = lx;
      y = ly;
      path.push([x, y]);
      continue;
    }

    // 뒤로 (후진)
    let backDir = (dir + 2) % 4;
    let [bx, by] = moveInDirection(x, y, backDir);
    if (isPath(bx, by)) {
      dir = backDir;
      x = bx;
      y = by;
      path.push([x, y]);
      continue;
    }

    // 막힘 (불가능한 경우)
    break;
  }

  return path;
}

function moveInDirection(x, y, dir) {
  switch(dir) {
    case 0: return [x - 1, y]; // 북
    case 1: return [x, y + 1]; // 동
    case 2: return [x + 1, y]; // 남
    case 3: return [x, y - 1]; // 서
  }
}


function aStarSimulationPath(maze) {
  const [startX, startY] = findStartPosition(maze);
  const [endX, endY] = findEndPosition(maze);
  const rows = maze.length;
  const cols = maze[0].length;

  function heuristic(x, y) {
    return Math.abs(x - endX) + Math.abs(y - endY);
  }

  let openSet = [];
  let cameFrom = new Map();
  let gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  let fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  let closedSet = Array.from({ length: rows }, () => Array(cols).fill(false));

  function nodeKey(x, y) {
    return `${x},${y}`;
  }

  gScore[startX][startY] = 0;
  fScore[startX][startY] = heuristic(startX, startY);

  openSet.push({ x: startX, y: startY, f: fScore[startX][startY] });

  const exploredPath = [];
  exploredPath.push([startX, startY]);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const { x, y } = current;

    if (closedSet[x][y]) continue;

    closedSet[x][y] = true;

    // 방문(확정) 노드 기록
    exploredPath.push([x, y]);

    if (x === endX && y === endY) {
      // 경로 복원
      const path = [];
      let curKey = nodeKey(x, y);
      while (cameFrom.has(curKey)) {
        const [cx, cy] = curKey.split(',').map(Number);
        path.push([cx, cy]);
        curKey = cameFrom.get(curKey);
      }
      path.push([startX, startY]);
      path.reverse();

      return { finalPath: path, fullExploredPath: exploredPath };
    }

    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (
        nx < 0 || ny < 0 || nx >= rows || ny >= cols ||
        maze[nx][ny] === 1 || closedSet[nx][ny]
      ) continue;

      const tentativeG = gScore[x][y] + 1;

      if (tentativeG < gScore[nx][ny]) {
        cameFrom.set(nodeKey(nx, ny), nodeKey(x, y));
        gScore[nx][ny] = tentativeG;
        fScore[nx][ny] = tentativeG + heuristic(nx, ny);

        if (!openSet.some(n => n.x === nx && n.y === ny)) {
          openSet.push({ x: nx, y: ny, f: fScore[nx][ny] });

          // 방문 후보로 추가될 때도 기록 (선택사항)
          exploredPath.push([nx, ny]);
        }
      }
    }
  }

  // 경로 못 찾음
  return { finalPath: [], fullExploredPath: exploredPath };
}