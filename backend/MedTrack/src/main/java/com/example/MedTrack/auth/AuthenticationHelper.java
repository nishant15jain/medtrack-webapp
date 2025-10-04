package com.example.MedTrack.auth;

import com.example.MedTrack.exceptions.ResourceNotFoundException;
import com.example.MedTrack.exceptions.UnauthorizedException;
import com.example.MedTrack.users.User;
import com.example.MedTrack.users.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationHelper {
    
    private final UserRepository userRepository;
    
    public AuthenticationHelper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * Gets the currently authenticated user ID from the security context
     */
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof String) {
            return Long.parseLong((String) authentication.getPrincipal());
        }
        throw new UnauthorizedException("No authenticated user found");
    }
    
    /**
     * Gets the currently authenticated user entity
     */
    public User getCurrentUser() {
        Long userId = getCurrentUserId();
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
}
