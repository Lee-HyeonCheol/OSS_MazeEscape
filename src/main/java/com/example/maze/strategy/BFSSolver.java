// strategy/BFSSolver.java
package com.example.maze.strategy;

import com.example.maze.dto.SimulationResponse;
import com.example.maze.util.Position;
import com.example.maze.util.MazeConstants;

import static com.example.maze.util.MazeUtil.*;

import java.util.*;

public class BFSSolver implements MazeSolver {

    @Override
    public SimulationResponse solve(int[][] maze) {
        int rows = maze.length;
        int cols = maze[0].length;

        Position start = findStart(maze);
        Position end = findEnd(maze);
        if (start == null || end == null) return new SimulationResponse(List.of(), List.of());

        boolean[][] visited = new boolean[rows][cols];
        Map<Position, Position> parent = new HashMap<>();
        Queue<Position> queue = new LinkedList<>();
        List<Position> explored = new ArrayList<>();

        queue.add(start);
        visited[start.getX()][start.getY()] = true;

        boolean found = false;

        while (!queue.isEmpty()) {
            Position current = queue.poll();
            explored.add(current);

            if (current.equals(end)) {
                found = true;
                break;
            }

            for (Position next : getNeighbors(current, maze)) {
                int x = next.getX();
                int y = next.getY();
                if (!visited[x][y]) {
                    visited[x][y] = true;
                    parent.put(next, current);
                    queue.add(next);
                }
            }
        }

        List<Position> path = new ArrayList<>();
        if (found) {
            Position cur = end;
            while (cur != null) {
                path.add(cur);
                cur = parent.get(cur);
            }
            Collections.reverse(path);
        }

        return new SimulationResponse(path, explored);
    }

    private List<Position> getNeighbors(Position p, int[][] maze) {
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        List<Position> result = new ArrayList<>();
        for (int[] d : dirs) {
            int nx = p.getX() + d[0];
            int ny = p.getY() + d[1];
            if (nx >= 0 && ny >= 0 && nx < maze.length && ny < maze[0].length &&
                    maze[nx][ny] != MazeConstants.WALL) {
                result.add(new Position(nx, ny));
            }
        }
        return result;
    }

}
