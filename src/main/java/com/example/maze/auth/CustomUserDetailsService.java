package com.example.maze.auth;

import com.example.maze.domain.UserEntity;
import com.example.maze.repository.UserEntityRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserEntityRepository repository;

    public CustomUserDetailsService(UserEntityRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자 없음"));
        return new CustomUserDetails(user);
    }
}

