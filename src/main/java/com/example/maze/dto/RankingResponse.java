package com.example.maze.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class RankingResponse {
    private String username;
    private double elapsedTime;
    private int moveCount;
    private int mazeSize;
    private int score;

    public RankingResponse(String username, double elapsedTime, int moveCount, int mazeSize) {
        this.username = username;
        this.elapsedTime = elapsedTime;
        this.moveCount = moveCount;
        this.mazeSize = mazeSize;
        this.score = calculateScore();
    }

    private int calculateScore() {
        return (int) (3000 * Math.pow(mazeSize, 1.4) /
                        (elapsedTime * 1.5 + moveCount * 1.2));
    }

}

