package com.example.maze.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class RankingResponse {
    private String username;
    private double bestTime;
    private int moveCount;

}
