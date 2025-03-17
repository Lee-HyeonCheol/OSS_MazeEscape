#include <bits/stdc++.h>
#include <random>
using namespace std;

int N;
int dy[4] = { -1, 0, 1, 0 };
int dx[4] = { 0, -1, 0, 1 };
vector<vector<int>> board;
vector<vector<bool>> visited;
vector<pair<int, int>> mazePath;

bool is_in_range(int y, int x) {
	return y >= 0 && y < N && x >= 0 && x < N;
}

int inputN() {
	int n;
	cout << "Enter n (maze size) : ";
	cin >> n;
	return n;
}

bool dfs(int y, int x) {
	if (y == board.size() - 1 && x == board.size() - 1) {
		mazePath.push_back({ y, x });
		return true;
	}

	vector<int> numbers = { 0, 1, 2, 3 };
	vector<double> weights = { 0.1 , 0.2, 0.3, 0.4 };
	
	random_device rd;
	mt19937 g(rd());

	vector<int> result(4, -1);

	for (int i = 0; i < 4; i++) {
		discrete_distribution<int> dist(weights.begin(), weights.end());
		int idx;
		do {
			idx = dist(g);
		} while (find(result.begin(), result.end(), numbers[idx]) != result.end());

		result[i] = numbers[idx];
	}

	for (auto & i : result) {
		int ny = y + dy[i];
		int nx = x + dx[i];
		if (is_in_range(ny, nx) && !visited[ny][nx]) {
			visited[ny][nx] = true;
			if (dfs(ny, nx)) {
				mazePath.push_back({ y, x });
				return true;
			}
			visited[ny][nx] = false;
		}
	}
	return false;
}

void makeMaze() {
	visited = vector<vector<bool>>(N, vector<bool>(N, false));
	visited[0][0] = true;
	dfs(0, 0);
	for (auto& it : mazePath)
		board[it.first][it.second] = 1;
}

void boardInit() {
	board = vector<vector<int>>(N, vector<int>(N, 0));
	makeMaze();
}

void printBoard() {
	int n = board.size();
	cout << "This is new board\n";
	cout << "1234567890123...\n";
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++)
			if (board[i][j] == 0)
				cout << '#';
			else
				cout << ' ';
		cout << '\n';
	}
}

int main(void) {
	vector<vector<int>> board;
	N = inputN();
	boardInit();
	printBoard();
}
