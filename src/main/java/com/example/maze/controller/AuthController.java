package com.example.maze.controller;

import com.example.maze.dto.UserJoinRequest;
import com.example.maze.dto.UserLoginRequest;
import com.example.maze.dto.UserResponse;
import com.example.maze.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/auth/join")
    public String join(UserJoinRequest request, Model model) {
        try {
            userService.join(request);
            return "redirect:/login";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "join"; // 회원가입 폼으로 다시 돌아감
        }
    }


    @PostMapping("/auth/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
}
