package com.example.maze.util;

public class Timer {
    private long startTime;

    public void start() {
        startTime = System.nanoTime();
    }

    public long stopMillis() {
        return (System.nanoTime() - startTime) / 1_000_000;
    }

    public double stopSeconds() {
        return (System.nanoTime() - startTime) / 1_000_000_000.0;
    }
}
