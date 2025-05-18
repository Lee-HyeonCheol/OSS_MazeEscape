// controller/SimulationController.java
package com.example.maze.controller;

import com.example.maze.dto.SimulationRequest;
import com.example.maze.dto.SimulationResponse;
import com.example.maze.service.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;

    @PostMapping("/{type}")
    public ResponseEntity<SimulationResponse> simulate(
            @PathVariable String type,
            @RequestBody SimulationRequest request
    ) {
        return ResponseEntity.ok(simulationService.run(type, request.getMaze()));
    }
}
