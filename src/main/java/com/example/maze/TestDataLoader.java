package com.example.maze;

import com.example.maze.domain.UserEntity;
import com.example.maze.repository.UserEntityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.maze.domain.EscapeRecord;
import com.example.maze.repository.EscapeRecordRepository;

import java.time.LocalDateTime;


@Component
public class TestDataLoader implements CommandLineRunner {

    private final UserEntityRepository userEntityRepository;
    private final EscapeRecordRepository escapeRecordRepository;

    public TestDataLoader(UserEntityRepository userEntityRepository, EscapeRecordRepository escapeRecordRepository) {
        this.userEntityRepository = userEntityRepository;
        this.escapeRecordRepository = escapeRecordRepository;
    }

    @Override
    public void run(String... args) {
        if (userEntityRepository.count() == 0) {
            UserEntity user1 = userEntityRepository.save(UserEntity.builder()
                    .username("testuser1")
                    .password("pass1") // 실제 환경에선 인코딩 필요
                    .build());

            UserEntity user2 = userEntityRepository.save(UserEntity.builder()
                    .username("testuser2")
                    .password("pass2")
                    .build());

            // 테스트용 미로 탈출 기록 생성
            escapeRecordRepository.save(EscapeRecord.builder()
                    .user(user1)
                    .mazeSize(9)
                    .elapsedTime(12.5)
                    .moveCount(20)
                    .createdAt(LocalDateTime.now())
                    .build());

            escapeRecordRepository.save(EscapeRecord.builder()
                    .user(user2)
                    .mazeSize(9)
                    .elapsedTime(10.2)
                    .moveCount(18)
                    .createdAt(LocalDateTime.now())
                    .build());

            System.out.println("test user & maze escape sample data insertion.");
        }
    }

}
