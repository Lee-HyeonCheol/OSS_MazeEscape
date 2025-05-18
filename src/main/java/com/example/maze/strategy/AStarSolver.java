// strategy/AStarSolver.java
package com.example.maze.strategy;

import com.example.maze.dto.SimulationResponse;
import com.example.maze.util.Position;
import com.example.maze.util.MazeConstants;
import static com.example.maze.util.MazeUtil.*;

import java.util.*;

public class AStarSolver implements MazeSolver {

    @Override
    public SimulationResponse solve(int[][] maze) {
        int rows = maze.length;
        int cols = maze[0].length;

        Position start = findStart(maze);
        Position end = findEnd(maze);
        if (start == null || end == null) return new SimulationResponse(List.of(), List.of());

        PriorityQueue<Node> open = new PriorityQueue<>(Comparator.comparingInt(n -> n.f));
        Map<Position, Integer> gScore = new HashMap<>();
        Map<Position, Position> cameFrom = new HashMap<>();
        Set<Position> closed = new HashSet<>();
        List<Position> explored = new ArrayList<>();

        gScore.put(start, 0);
        open.add(new Node(start, heuristic(start, end)));

        while (!open.isEmpty()) {
            Node current = open.poll();
            Position pos = current.pos;

            if (closed.contains(pos)) continue;
            closed.add(pos);
            explored.add(pos);

            if (pos.equals(end)) {
                List<Position> path = new ArrayList<>();
                Position cur = pos;
                while (cur != null) {
                    path.add(cur);
                    cur = cameFrom.get(cur);
                }
                Collections.reverse(path);
                return new SimulationResponse(path, explored);
            }

            for (Position neighbor : getNeighbors(pos, maze)) {
                if (closed.contains(neighbor)) continue;
                int tentativeG = gScore.getOrDefault(pos, Integer.MAX_VALUE) + 1;

                if (tentativeG < gScore.getOrDefault(neighbor, Integer.MAX_VALUE)) {
                    gScore.put(neighbor, tentativeG);
                    cameFrom.put(neighbor, pos);
                    int f = tentativeG + heuristic(neighbor, end);
                    open.add(new Node(neighbor, f));
                }
            }
        }

        return new SimulationResponse(List.of(), explored);
    }

    private int heuristic(Position a, Position b) {
        return Math.abs(a.getX() - b.getX()) + Math.abs(a.getY() - b.getY());
    }

    private List<Position> getNeighbors(Position p, int[][] maze) {
        int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
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

    private static class Node {
        Position pos;
        int f;

        Node(Position pos, int f) {
            this.pos = pos;
            this.f = f;
        }
    }
}
