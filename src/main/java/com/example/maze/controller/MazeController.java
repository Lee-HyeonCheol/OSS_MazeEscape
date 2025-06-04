package com.example.maze.controller;

import com.example.maze.dto.MazeResponse;
import com.example.maze.service.MazeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/maze")
public class MazeController {

    private final MazeService mazeService;

    public MazeController(MazeService mazeService) {
        this.mazeService = mazeService;
    }

    @GetMapping("/create")
    public ResponseEntity<MazeResponse> createMaze(@RequestParam int size) {
        if (size % 2 == 0) size--;
        int[][] maze = mazeService.createMaze(size);
        return ResponseEntity.ok(new MazeResponse(maze));
    }
}
