// strategy/RightHandSolver.java
package com.example.maze.strategy;

import com.example.maze.dto.SimulationResponse;
import com.example.maze.util.Position;
import com.example.maze.util.MazeConstants;

import static com.example.maze.util.MazeUtil.*;

import java.util.ArrayList;
import java.util.List;

public class RightHandSolver implements MazeSolver {

    private static final int[][] DIRS = {
            {-1, 0}, // 북
            {0, 1},  // 동
            {1, 0},  // 남
            {0, -1}  // 서
    };

    @Override
    public SimulationResponse solve(int[][] maze) {
        Position start = findStart(maze);
        Position end = findEnd(maze);
        if (start == null || end == null) return new SimulationResponse(List.of(), List.of());

        int dir = 0; // 시작 방향: 북쪽
        int x = start.getX();
        int y = start.getY();

        List<Position> path = new ArrayList<>();
        path.add(new Position(x, y));

        while (!(x == end.getX() && y == end.getY())) {
            // 오른쪽 방향 우선 탐색
            int right = (dir + 1) % 4;
            int[] r = DIRS[right];
            if (isPath(maze, x + r[0], y + r[1])) {
                dir = right;
                x += r[0];
                y += r[1];
                path.add(new Position(x, y));
                continue;
            }

            // 직진
            int[] f = DIRS[dir];
            if (isPath(maze, x + f[0], y + f[1])) {
                x += f[0];
                y += f[1];
                path.add(new Position(x, y));
                continue;
            }

            // 왼쪽
            int left = (dir + 3) % 4;
            int[] l = DIRS[left];
            if (isPath(maze, x + l[0], y + l[1])) {
                dir = left;
                x += l[0];
                y += l[1];
                path.add(new Position(x, y));
                continue;
            }

            // 뒤로
            int back = (dir + 2) % 4;
            int[] b = DIRS[back];
            if (isPath(maze, x + b[0], y + b[1])) {
                dir = back;
                x += b[0];
                y += b[1];
                path.add(new Position(x, y));
                continue;
            }

            // 막힘
            break;
        }

        return new SimulationResponse(path, path);
    }

    private boolean isPath(int[][] maze, int x, int y) {
        return x >= 0 && y >= 0 && x < maze.length && y < maze[0].length &&
                maze[x][y] != MazeConstants.WALL;
    }
}
