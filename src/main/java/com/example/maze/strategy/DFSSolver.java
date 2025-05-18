// strategy/DFSSolver.java
package com.example.maze.strategy;

import com.example.maze.dto.SimulationResponse;
import com.example.maze.util.Position;
import com.example.maze.util.MazeConstants;

import static com.example.maze.util.MazeUtil.*;

import java.util.ArrayList;
import java.util.List;

public class DFSSolver implements MazeSolver {

    private boolean[][] visited;
    private List<Position> finalPath;
    private List<Position> fullExploredPath;
    private int endX, endY;
    private boolean found;

    @Override
    public SimulationResponse solve(int[][] maze) {
        int n = maze.length;
        int m = maze[0].length;

        visited = new boolean[n][m];
        finalPath = new ArrayList<>();
        fullExploredPath = new ArrayList<>();
        found = false;

        Position start = findStart(maze);
        Position end = findEnd(maze);
        if (start == null || end == null)
            return new SimulationResponse(new ArrayList<>(), new ArrayList<>());

        endX = end.getX();
        endY = end.getY();

        dfs(maze, start.getX(), start.getY());

        return new SimulationResponse(finalPath, fullExploredPath);
    }

    private void dfs(int[][] maze, int x, int y) {
        if (found || x < 0 || y < 0 || x >= maze.length || y >= maze[0].length)
            return;
        if (maze[x][y] == MazeConstants.WALL || visited[x][y])
            return;

        visited[x][y] = true;
        finalPath.add(new Position(x, y));
        fullExploredPath.add(new Position(x, y));

        if (x == endX && y == endY) {
            found = true;
            return;
        }

        dfs(maze, x - 1, y);
        if (!found) fullExploredPath.add(new Position(x, y));
        dfs(maze, x + 1, y);
        if (!found) fullExploredPath.add(new Position(x, y));
        dfs(maze, x, y - 1);
        if (!found) fullExploredPath.add(new Position(x, y));
        dfs(maze, x, y + 1);
        if (!found) fullExploredPath.add(new Position(x, y));

        if (!found) finalPath.remove(finalPath.size() - 1);
    }

}
