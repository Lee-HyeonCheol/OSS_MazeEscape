// util/MazeUtil.java
package com.example.maze.util;

public class MazeUtil {

    public static Position findStart(int[][] maze) {
        for (int i = 0; i < maze.length; i++) {
            for (int j = 0; j < maze[0].length; j++) {
                if (maze[i][j] == MazeConstants.START) {
                    return new Position(i, j);
                }
            }
        }
        return null;
    }

    public static Position findEnd(int[][] maze) {
        for (int i = 0; i < maze.length; i++) {
            for (int j = 0; j < maze[0].length; j++) {
                if (maze[i][j] == MazeConstants.END) {
                    return new Position(i, j);
                }
            }
        }
        return null;
    }
}
