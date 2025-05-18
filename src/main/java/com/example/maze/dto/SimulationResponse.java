// dto/SimulationResponse.java
package com.example.maze.dto;

import com.example.maze.util.Position;
import java.util.List;

public class SimulationResponse {
    private List<Position> finalPath;
    private List<Position> fullExploredPath;

    public SimulationResponse() {}

    public SimulationResponse(List<Position> finalPath, List<Position> fullExploredPath) {
        this.finalPath = finalPath;
        this.fullExploredPath = fullExploredPath;
    }

    public List<Position> getFinalPath() {
        return finalPath;
    }

    public void setFinalPath(List<Position> finalPath) {
        this.finalPath = finalPath;
    }

    public List<Position> getFullExploredPath() {
        return fullExploredPath;
    }

    public void setFullExploredPath(List<Position> fullExploredPath) {
        this.fullExploredPath = fullExploredPath;
    }
}
