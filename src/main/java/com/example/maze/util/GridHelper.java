package com.example.maze.util;

public class GridHelper {

    public static boolean isInBounds(int[][] grid, int x, int y) {
        return x >= 0 && y >= 0 && x < grid.length && y < grid[0].length;
    }

    public static int[][] createEmptyGrid(int size, int fillValue) {
        int[][] grid = new int[size][size];
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                grid[i][j] = fillValue;
            }
        }
        return grid;
    }
}
