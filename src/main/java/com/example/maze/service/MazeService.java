package com.example.maze.service;

import com.example.maze.util.MazeGenerator;
import org.springframework.stereotype.Service;

@Service
public class MazeService {

    public int[][] createMaze(int size) {
        return MazeGenerator.generateMaze(size);
    }
}
