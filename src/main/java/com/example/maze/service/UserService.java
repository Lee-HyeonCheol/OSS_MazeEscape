package com.example.maze.service;

import com.example.maze.domain.UserEntity;
import com.example.maze.dto.UserJoinRequest;
import com.example.maze.dto.UserResponse;
import com.example.maze.repository.UserEntityRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserEntityRepository repository;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserEntityRepository repository, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public UserResponse join(UserJoinRequest request) {
        if (repository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 사용자명입니다.");
        }

        UserEntity user = UserEntity.builder()
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .build();

        UserEntity saved = repository.save(user);
        return new UserResponse(saved.getId(), saved.getUsername());
    }
}
