// strategy/DijkstraSolver.java
package com.example.maze.strategy;

import com.example.maze.dto.SimulationResponse;
import com.example.maze.util.Position;
import com.example.maze.util.MazeConstants;

import static com.example.maze.util.MazeUtil.*;

import java.util.*;

public class DijkstraSolver implements MazeSolver {

    private static final int[][] DIRECTIONS = {{-1,0}, {1,0}, {0,-1}, {0,1}};

    @Override
    public SimulationResponse solve(int[][] maze) {
        int n = maze.length;
        int m = maze[0].length;

        Position start = findStart(maze);
        Position end = findEnd(maze);
        if (start == null || end == null)
            return new SimulationResponse(new ArrayList<>(), new ArrayList<>());

        int[][] dist = new int[n][m];
        Position[][] prev = new Position[n][m];
        boolean[][] visited = new boolean[n][m];
        List<Position> fullExploredPath = new ArrayList<>();

        for (int[] row : dist)
            Arrays.fill(row, Integer.MAX_VALUE);

        dist[start.getX()][start.getY()] = 0;
        PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingInt(n1 -> n1.cost));
        pq.offer(new Node(start.getX(), start.getY(), 0));

        while (!pq.isEmpty()) {
            Node curr = pq.poll();
            int x = curr.x, y = curr.y;

            if (visited[x][y]) continue;
            visited[x][y] = true;
            fullExploredPath.add(new Position(x, y));

            if (x == end.getX() && y == end.getY()) break;

            for (int[] d : DIRECTIONS) {
                int nx = x + d[0], ny = y + d[1];
                if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
                if (maze[nx][ny] == MazeConstants.WALL || visited[nx][ny]) continue;

                int newCost = dist[x][y] + 1;
                if (newCost < dist[nx][ny]) {
                    dist[nx][ny] = newCost;
                    prev[nx][ny] = new Position(x, y);
                    pq.offer(new Node(nx, ny, newCost));
                }
            }
        }

        List<Position> finalPath = new ArrayList<>();
        Position at = end;
        while (at != null) {
            finalPath.add(at);
            at = prev[at.getX()][at.getY()];
        }

        Collections.reverse(finalPath);

        if (!finalPath.get(0).equals(start)) // 경로가 도달하지 못한 경우
            finalPath.clear();

        return new SimulationResponse(finalPath, fullExploredPath);
    }

    private static class Node {
        int x, y, cost;
        Node(int x, int y, int cost) {
            this.x = x;
            this.y = y;
            this.cost = cost;
        }
    }
}
