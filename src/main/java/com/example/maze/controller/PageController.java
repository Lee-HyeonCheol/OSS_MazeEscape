package com.example.maze.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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

    @GetMapping("/home")
    public String homePage() {
        return "home";  // resources/templates/home.html
    }

    @GetMapping("/ranking")
    public String rankingPage() {
        return "ranking"; // ranking.html
    }

}
