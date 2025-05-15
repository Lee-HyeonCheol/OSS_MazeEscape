package com.example.maze.dto;

import com.example.maze.domain.EscapeRecord;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EscapeRecordRequest {
    private int mazeSize;
    private double elapsedTime;
    private int moveCount;
    private List<List<Integer>> movePath;  // 이동 좌표 리스트 [[x,y], [x,y], ...]
}
