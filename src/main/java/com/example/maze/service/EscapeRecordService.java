package com.example.maze.service;

import com.example.maze.domain.EscapeRecord;
import com.example.maze.domain.UserEntity;
import com.example.maze.dto.EscapeRecordRequest;
import com.example.maze.dto.RankingResponse;
import com.example.maze.repository.EscapeRecordRepository;
import com.example.maze.repository.UserEntityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EscapeRecordService {

    private final EscapeRecordRepository recordRepository;
    private final UserEntityRepository userRepository;

    public EscapeRecordService(EscapeRecordRepository recordRepository, UserEntityRepository userRepository) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
    }

    public void save(String username, EscapeRecordRequest request) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        EscapeRecord record = EscapeRecord.builder()
                .mazeSize(request.getMazeSize())
                .elapsedTime(request.getElapsedTime())
                .moveCount(request.getMoveCount())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        recordRepository.save(record);
    }

    public List<RankingResponse> getTopRankings() {
        List<Object[]> rawResults = recordRepository.findTopRankings();
        return rawResults.stream()
                .map(o -> new RankingResponse(
                        (String) o[0],
                        (Double) o[1],
                        (Integer) o[2]
                ))
                .collect(Collectors.toList());
    }

    public int getUserRank(String username) {
        return recordRepository.findUserRank(username);
    }

    public EscapeRecord getBestRecordByUser(String username) {
        return recordRepository.findUserRecordsOrderByElapsedTime(username).stream().findFirst().orElse(null);
    }
}
