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
let simulationSpeed = 300;

let simulationResults = [];  // 알고리즘별 경로 데이터 저장

function generateMaze() {
	const input = document.getElementById('size');
    const error = document.getElementById('error');
    let val = parseInt(input.value);

    // 오류 조건 검사
    if (isNaN(val)) {
        error.textContent = "숫자를 입력해주세요.";
        return;
    }
    if (val < 3) {
        error.textContent = "미로 사이즈는 3 이상이어야 합니다.";
        return;
    }

    // 짝수면 보정
    if (val % 2 === 0) {
        val -= 1;
        input.value = val;
    }

    error.textContent = ""; // 오류 없으면 메시지 제거

    if (simulationInterval) {
        stopSimulation();
    }
    hasStarted = false;
    hasEscaped = false;
    movePath = [];
	simulationResults = [];
	document.getElementById('resultPanel').style.display = 'none';

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
            mazeData = data.maze ?? data;
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

            div.dataset.x = i.toString();
            div.dataset.y = j.toString();

            container.appendChild(div);
        }
    }

    updatePlayerPosition(null, null, playerX, playerY);
}

function updatePlayerPosition(prevX, prevY, nextX, nextY) {
    if (prevX !== null && prevY !== null) {
        const prev = document.querySelector(`.cell[data-x="${prevX}"][data-y="${prevY}"]`);
        if (prev) prev.classList.remove('player');
    }

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

				if (!simulationResults.some(r => r.algorithm === 'User')) {
                    simulationResults.push({
                        algorithm: 'User',
                        moveCount: movePath.length,
                        success: true
                    });
                }

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

function clearPlayerMarker() {
    const prevPlayerCell = document.querySelector('.cell.player');
    if (prevPlayerCell) prevPlayerCell.classList.remove('player');
}

function startSimulation(type) {
    if (simulationInterval) stopSimulation();
    clearPlayerMarker();

    document.querySelectorAll('.simulation-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('disabled-sim');  // 초기화
    });

    let btnId;
    switch (type) {
        case 'AStar': btnId = 'aStarSimulationBtn'; break;
        case 'RightHand': btnId = 'rightHandSimulationBtn'; break;
        case 'MinimumDistance': btnId = 'minimumDistanceSimulationBtn'; break;
        case 'User': btnId = 'userSimulationBtn'; break;
        default: btnId = type.toLowerCase() + 'SimulationBtn'; break;
    }

    const simBtn = document.getElementById(btnId);
    if (simBtn) {
        simBtn.disabled = true;
        simBtn.classList.add('disabled-sim');  //  회색화
    }

    if (type === 'User') {
        currentSimPath = movePath;
        runSimulation();
        return;
    }

    fetch(`/simulation/${type.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maze: mazeData })
    })
        .then(res => res.json())
        .then(data => {
            if (type === 'MinimumDistance') {
                currentSimPath = data.finalPath.map(p => [p.x, p.y]); // 최단경로만 사용
            } else {
                currentSimPath = data.fullExploredPath.map(p => [p.x, p.y]); // 전체 경로사용
            }

			currentSimPath = removeConsecutive(currentSimPath);

			//  경로 길이 저장
            const existing = simulationResults.find(r => r.algorithm === type);
            if (!existing) {
                simulationResults.push({
                    algorithm: type,
                    moveCount: currentSimPath.length,
                    success: currentSimPath.length > 0
                });
            }

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

    showSimulationResults();

    currentSimIndex = 0;
    playerX = currentSimPath[0][0];
    playerY = currentSimPath[0][1];
    updatePlayerPosition(null, null, playerX, playerY);

    const stopBtn = document.getElementById('stopSimulationBtn');
    stopBtn.disabled = false;
    stopBtn.style.display = 'inline-block';

    simulationInterval = true;  // 실행 중 여부 체크용 플래그

    function step() {
        if (!simulationInterval) return;  // 종료되었으면 중단

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

        // 다음 단계 예약 (현재 simulationSpeed를 반영)
        setTimeout(step, simulationSpeed);
    }

    setTimeout(step, simulationSpeed);  // 첫 스텝 시작
}

function stopSimulation() {
    simulationInterval = false;

    document.querySelectorAll('.simulation-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('disabled-sim');
        btn.classList.remove('active-simulation');
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

function showSimulationButtons() {
    const simButtons = [
        { id: 'minimumDistanceSimulationBtn', text: '최단 거리 시뮬레이션', onClick: () => startSimulation('MinimumDistance') },
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
            btn.classList.add('simulation-btn');
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

    showSimulationResults();
    showSimulationSpeedControls();
}

function showSimulationResults() {
    const panel = document.getElementById('resultPanel');
    const list = document.getElementById('resultList');
    panel.style.display = 'block';

    // 오름차순 정렬
    const sorted = [...simulationResults].sort((a, b) => a.moveCount - b.moveCount);

    list.innerHTML = ''; // 초기화
    sorted.forEach(result => {
        const li = document.createElement('li');
        li.textContent = `${result.algorithm} - ${result.success ? result.moveCount + '칸' : '실패'}`;
        list.appendChild(li);
    });
}

function showSimulationSpeedControls() {
    const speedPanelId = 'speedControlPanel';
    let panel = document.getElementById(speedPanelId);
    if (!panel) {
        panel = document.createElement('div');
        panel.id = speedPanelId;
        panel.style.marginTop = '10px';

        const label = document.createElement('span');
        label.textContent = '⏱ 시뮬레이션 속도: ';
        panel.appendChild(label);

        const speeds = [
            { label: '느리게', value: 600 },
            { label: '보통', value: 300 },
            { label: '빠르게', value: 100 },
            { label: '초고속', value: 30 }
        ];

        speeds.forEach(({ label, value }) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.onclick = () => {
                simulationSpeed = value;

                // 이전 버튼 활성화 및 스타일 제거
                if (currentSpeedBtn) {
                    currentSpeedBtn.classList.remove('active-speed');
                    currentSpeedBtn.disabled = false;
                }

                // 현재 버튼 비활성화 및 스타일 지정
                btn.classList.add('active-speed');
                btn.disabled = true;
                currentSpeedBtn = btn;

                console.log(`속도 설정됨: ${value}ms`);
            };
            btn.style.margin = '0 5px';
            panel.appendChild(btn);

            if (value === simulationSpeed) {
                    btn.classList.add('active-speed');
                    btn.disabled = true;
                    currentSpeedBtn = btn;
                }
        });

        document.body.appendChild(panel);
    }
}