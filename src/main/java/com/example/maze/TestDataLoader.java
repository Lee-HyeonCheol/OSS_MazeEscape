package com.example.maze;

import com.example.maze.domain.UserEntity;
import com.example.maze.repository.UserEntityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TestDataLoader implements CommandLineRunner {

    private final UserEntityRepository userEntityRepository;

    public TestDataLoader(UserEntityRepository userEntityRepository) {
        this.userEntityRepository = userEntityRepository;
    }

    @Override
    public void run(String... args) {
        if (userEntityRepository.count() == 0) {
            userEntityRepository.save(UserEntity.builder()
                    .username("testuser1")
                    .password("pass1")
                    .build());

            userEntityRepository.save(UserEntity.builder()
                    .username("testuser2")
                    .password("pass2")
                    .build());

            System.out.println(" 테스트 유저 데이터 삽입 완료");
        }
    }
}
