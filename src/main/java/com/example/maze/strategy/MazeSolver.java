// strategy/MazeSolver.java
package com.example.maze.strategy;

import com.example.maze.dto.SimulationResponse;

public interface MazeSolver {
    SimulationResponse solve(int[][] maze);
}
