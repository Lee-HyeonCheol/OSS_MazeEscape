package com.example.maze.controller;

import com.example.maze.service.MazeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/maze")
public class MazeController {

    private final MazeService mazeService;

    public MazeController(MazeService mazeService) {
        this.mazeService = mazeService;
    }

    @GetMapping("/create")
    public int[][] createMaze(@RequestParam(defaultValue = "10") int size) {
        return mazeService.createMaze(size);
    }
}
