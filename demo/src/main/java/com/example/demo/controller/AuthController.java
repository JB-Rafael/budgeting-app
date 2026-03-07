package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.MessageResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
public Object register(@RequestParam String email,
                       @RequestParam String password) {
    System.out.println("Email received: " + email);
    if (userRepository.findByEmail(email).isPresent()) {
        return new MessageResponse("Email already exists");
    }

    String hashed = passwordEncoder.encode(password);

    User user = new User(email, hashed);
    userRepository.save(user);

    return new MessageResponse("User registered");
}

    @PostMapping("/login")
public Object login(@RequestParam String email,
                    @RequestParam String password) {

    var optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isEmpty()) {
        return new MessageResponse("User not found");
    }

    User user = optionalUser.get();

    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
        return new MessageResponse("Invalid password");
    }

    return new MessageResponse("Login successful");
}
}