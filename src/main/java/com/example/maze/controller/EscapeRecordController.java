package com.example.maze.controller;

import com.example.maze.domain.EscapeRecord;
import com.example.maze.dto.EscapeRecordRequest;
import com.example.maze.dto.RankingResponse;
import com.example.maze.service.EscapeRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/result")
public class EscapeRecordController {

    private final EscapeRecordService escapeRecordService;

    public EscapeRecordController(EscapeRecordService escapeRecordService) {
        this.escapeRecordService = escapeRecordService;
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveRecord(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody EscapeRecordRequest request
    ) {
        escapeRecordService.save(userDetails.getUsername(), request);
        return ResponseEntity.ok("기록 저장 완료");
    }

    @GetMapping("/ranking")
    public ResponseEntity<?> getRanking(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        List<RankingResponse> topRankings = escapeRecordService.getTopRankings();
        int userRank = escapeRecordService.getUserRank(username);
        EscapeRecord myBest = escapeRecordService.getBestRecordByUser(username);

        Map<String, Object> response = new HashMap<>();
        response.put("topRankings", topRankings);
        response.put("myRank", userRank);
        response.put("myBest", myBest);

        return ResponseEntity.ok(response);
    }
}
