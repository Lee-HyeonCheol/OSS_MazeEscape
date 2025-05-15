package com.example.maze.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EscapeRecordRequest {
    private int mazeSize;
    private double elapsedTime;
    private int moveCount;
}
