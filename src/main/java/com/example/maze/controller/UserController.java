package com.example.maze.controller;

import com.example.maze.domain.UserEntity;
import com.example.maze.repository.UserEntityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserEntityRepository userEntityRepository;

    public UserController(UserEntityRepository userEntityRepository) {
        this.userEntityRepository = userEntityRepository;
    }

    @PostMapping
    public UserEntity createUser(@RequestBody UserEntity user) {
        return userEntityRepository.save(user);
    }

    @GetMapping
    public List<UserEntity> getAllUsers() {
        return userEntityRepository.findAll();
    }
}
