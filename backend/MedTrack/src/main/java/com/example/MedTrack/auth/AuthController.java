package com.example.MedTrack.auth;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.example.MedTrack.users.User;
import com.example.MedTrack.users.UserRepository;
import com.example.MedTrack.users.UserService;
import com.example.MedTrack.users.UserDto;
import com.example.MedTrack.users.UserRole;
import com.example.MedTrack.users.RegisterRequest;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "API for user authentication and registration")
public class AuthController {
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        return ResponseEntity.ok(new LoginResponse(token, user.getRole().name(), user.getName(), user.getEmail()));
    }

    @PostMapping("/register")
    @Operation(summary = "Admin registration", description = "Registers a new ADMIN user. Anyone can register as an admin.")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest request) {
        // Force the role to ADMIN for public registration
        request.setRole(UserRole.ADMIN);
        
        return ResponseEntity.ok(userService.createUser(request));
    }
}
