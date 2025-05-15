package com.example.maze.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Point {
    private int x;
    private int y;

    public Point move(Direction dir) {
        return new Point(x + dir.dx(), y + dir.dy());
    }
}
