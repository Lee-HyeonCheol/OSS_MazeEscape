package com.example.maze.service;

import com.example.maze.domain.EscapeRecord;
import com.example.maze.domain.UserEntity;
import com.example.maze.dto.EscapeRecordRequest;
import com.example.maze.dto.RankingResponse;
import com.example.maze.repository.EscapeRecordRepository;
import com.example.maze.repository.UserEntityRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EscapeRecordService {

    private final EscapeRecordRepository recordRepository;
    private final UserEntityRepository userRepository;
    private final ObjectMapper objectMapper;

    public EscapeRecordService(EscapeRecordRepository recordRepository,
                               UserEntityRepository userRepository, ObjectMapper objectMapper) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    // 기록 저장
    public void save(String username, EscapeRecordRequest request) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        String movePathJson = null;
        try {
            movePathJson = objectMapper.writeValueAsString(request.getMovePath());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("이동 경로 JSON 변환 실패", e);
        }

        EscapeRecord record = EscapeRecord.builder()
                .mazeSize(request.getMazeSize())
                .elapsedTime(request.getElapsedTime())
                .moveCount(request.getMoveCount())
                .movePathJson(movePathJson)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        recordRepository.save(record);
    }

    // 전체 랭킹 조회 (유저별 최고기록 기준)
    public List<RankingResponse> getTopRankings() {
        List<Object[]> rawResults = recordRepository.findTopRankings();

        return rawResults.stream()
                .map(o -> new RankingResponse(
                        (String) o[0],             // username
                        (Double) o[1],             // bestTime
                        (Integer) o[2]             // moveCount
                ))
                .collect(Collectors.toList());
    }

    // 현재 로그인한 유저의 최고 기록
    public RankingResponse getMyBest(String username) {
        EscapeRecord record = recordRepository.findUserRecordsOrderByElapsedTime(username)
                .stream()
                .findFirst()
                .orElse(null);

        if (record == null) return null;

        return new RankingResponse(
                record.getUser().getUsername(),
                record.getElapsedTime(),
                record.getMoveCount()
        );
    }

    // 현재 유저의 랭킹 순위
    public int getUserRank(String username) {
        return recordRepository.findUserRank(username);
    }

    public List<List<Integer>> getMovePath(Long recordId) {
        EscapeRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("기록 없음"));

        try {
            return objectMapper.readValue(
                    record.getMovePathJson(),
                    new TypeReference<List<List<Integer>>>() {}
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("이동 경로 JSON 파싱 실패", e);
        }
    }
}
