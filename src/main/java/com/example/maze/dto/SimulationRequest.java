// dto/SimulationRequest.java
package com.example.maze.dto;

public class SimulationRequest {
    private int[][] maze;

    public SimulationRequest() {}

    public SimulationRequest(int[][] maze) {
        this.maze = maze;
    }

    public int[][] getMaze() {
        return maze;
    }

    public void setMaze(int[][] maze) {
        this.maze = maze;
    }
}
