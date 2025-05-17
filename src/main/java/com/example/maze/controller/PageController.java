package com.example.maze.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;

@Controller
public class PageController {

    @GetMapping("/login")
    public String loginPage() {
        return "login"; // resources/templates/login.html
    }

    @GetMapping("/join")
    public String joinPage() {
        return "join";  // resources/templates/join.html
    }

    @GetMapping("/ranking")
    public String rankingPage() {
        return "ranking"; // ranking.html
    }

    @GetMapping("/home")
    public String home() {
        return "home"; // home.html
    }

    // 알고리즘 설명 페이지
    @GetMapping("/algorithm-description")
    public String algorithmDescription() {
        return "algorithmDescription"; // templates/algorithmDescription.html
    }

    // 문제 추천 페이지
    @GetMapping("/problems")
    public String problems() {
        return "problemRecommendation"; // templates/problemRecommendation.html
    }
}
