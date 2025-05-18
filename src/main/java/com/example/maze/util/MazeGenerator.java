package com.example.maze.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MazeGenerator {

    private static class Wall {
        int x, y;
        int px, py; // 벽과 연결된 방문 셀 좌표

        Wall(int x, int y, int px, int py) {
            this.x = x;
            this.y = y;
            this.px = px;
            this.py = py;
        }
    }

    public static int[][] generateMaze(int size) {
        if (size % 2 == 0) size -= 1; // 홀수 권장

        int[][] maze = new int[size][size];
        boolean[][] visited = new boolean[size][size];

        // 초기화: 벽으로 채우기
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                maze[i][j] = MazeConstants.WALL;
            }
        }

        Random rand = new Random();

        // 시작점 (0,0)을 길로 설정하고 방문 표시
        maze[0][0] = MazeConstants.START;
        visited[0][0] = true;

        List<Wall> walls = new ArrayList<>();
        addWalls(0, 0, size, visited, walls);

        while (!walls.isEmpty()) {
            int idx = rand.nextInt(walls.size());
            Wall w = walls.remove(idx);

            if (!visited[w.x][w.y]) {
                maze[w.x][w.y] = MazeConstants.PATH;
                // 벽 사이 중간 칸 허물기 (길로 만들기)
                int mx = (w.x + w.px) / 2;
                int my = (w.y + w.py) / 2;
                maze[mx][my] = MazeConstants.PATH;

                visited[w.x][w.y] = true;

                addWalls(w.x, w.y, size, visited, walls);
            }
        }

        // 도착점 (오른쪽 아래) 설정
        maze[size - 1][size - 1] = MazeConstants.END;

        return maze;
    }

    private static void addWalls(int x, int y, int size, boolean[][] visited, List<Wall> walls) {
        int[][] directions = {{0, 2}, {0, -2}, {2, 0}, {-2, 0}};

        for (int[] dir : directions) {
            int nx = x + dir[0];
            int ny = y + dir[1];

            if (nx >= 0 && ny >= 0 && nx < size && ny < size && !visited[nx][ny]) {
                walls.add(new Wall(nx, ny, x, y));
            }
        }
    }
}
