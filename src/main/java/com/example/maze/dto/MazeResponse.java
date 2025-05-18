package com.example.maze.dto;

public class MazeResponse {
    private int[][] maze;

    public MazeResponse(int[][] maze) {
        this.maze = maze;
    }

    public int[][] getMaze() {
        return maze;
    }

    public void setMaze(int[][] maze) {
        this.maze = maze;
    }
}