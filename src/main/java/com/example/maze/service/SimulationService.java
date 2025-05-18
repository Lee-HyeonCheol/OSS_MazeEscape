// service/SimulationService.java
package com.example.maze.service;

import com.example.maze.dto.SimulationResponse;
import com.example.maze.strategy.*;
import org.springframework.stereotype.Service;

@Service
public class SimulationService {

    // service/SimulationService.java
    public SimulationResponse run(String type, int[][] maze) {
        MazeSolver solver = switch (type.toLowerCase()) {
            case "dfs" -> new DFSSolver();
            case "bfs" -> new BFSSolver();
            case "astar" -> new AStarSolver();
            case "righthand" -> new RightHandSolver();
            default -> throw new IllegalArgumentException("지원하지 않는 알고리즘입니다: " + type);
        };
        return solver.solve(maze);
    }

}
