package com.example.maze.util;

import java.util.Random;

public class MazeGenerator {

    private static final Random random = new Random();

    public static int[][] generateMaze(int size) {
        int[][] maze = GridHelper.createEmptyGrid(size, MazeConstants.WALL);

        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                maze[i][j] = random.nextDouble() < 0.7 ? MazeConstants.PATH : MazeConstants.WALL;
            }
        }

        maze[0][0] = MazeConstants.START;
        maze[size - 1][size - 1] = MazeConstants.END;

        return maze;
    }
}
