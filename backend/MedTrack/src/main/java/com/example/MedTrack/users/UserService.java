package com.example.MedTrack.users;

import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.MedTrack.exceptions.ResourceNotFoundException;
import com.example.MedTrack.exceptions.BadRequestException;
import com.example.MedTrack.locations.Location;
import com.example.MedTrack.locations.LocationDto;
import com.example.MedTrack.locations.LocationService;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final LocationService locationService;
    
    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, LocationService locationService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.locationService = locationService;
    }

    public UserDto createUser(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }
        
        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // Ensure role is set (default to REP if not specified)
        if (user.getRole() == null) {
            user.setRole(UserRole.REP);
        }
        
        // Ensure user is active by default
        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }
        
        // Handle location assignments
        if (request.getLocationIds() != null && !request.getLocationIds().isEmpty()) {
            Set<Location> locations = new HashSet<>();
            for (Long locationId : request.getLocationIds()) {
                Location location = locationService.getLocationEntityById(locationId);
                locations.add(location);
            }
            user.setLocations(locations);
        }
        
        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findByIdWithLocations(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRole(UserRole role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        userMapper.updateEntity(userDto, user);
        
        // Handle password update if provided
        if (userDto.getPassword() != null && !userDto.getPassword().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userDto.getPassword()));
        }
        
        // Handle location updates if provided
        if (userDto.getLocationIds() != null) {
            Set<Location> locations = new HashSet<>();
            for (Long locationId : userDto.getLocationIds()) {
                Location location = locationService.getLocationEntityById(locationId);
                locations.add(location);
            }
            user.setLocations(locations);
        }
        
        // Update timestamp
        user.setUpdatedAt(java.time.LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public UserDto deactivateUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setIsActive(false);
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public UserDto activateUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setIsActive(true);
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }
    
    // Location-related methods
    
    public UserDto assignLocationsToUser(Long userId, List<Long> locationIds) {
        User user = userRepository.findByIdWithLocations(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Set<Location> locations = new HashSet<>();
        for (Long locationId : locationIds) {
            Location location = locationService.getLocationEntityById(locationId);
            locations.add(location);
        }
        user.setLocations(locations);
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }
    
    public UserDto addLocationToUser(Long userId, Long locationId) {
        User user = userRepository.findByIdWithLocations(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Location location = locationService.getLocationEntityById(locationId);
        user.getLocations().add(location);
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }
    
    public UserDto removeLocationFromUser(Long userId, Long locationId) {
        User user = userRepository.findByIdWithLocations(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Location location = locationService.getLocationEntityById(locationId);
        user.getLocations().remove(location);
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }
    
    public List<LocationDto> getUserLocations(Long userId) {
        User user = userRepository.findByIdWithLocations(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return user.getLocations().stream()
            .map(LocationDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<UserDto> getUsersByLocation(Long locationId) {
        Location location = locationService.getLocationEntityById(locationId);
        
        List<User> users = userRepository.findAll().stream()
            .filter(user -> user.getLocations().contains(location))
            .collect(Collectors.toList());
        
        return users.stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }
    
    // Helper method to map User to UserDto with locations
    private UserDto mapToDto(User user) {
        UserDto dto = userMapper.toDto(user);
        
        if (user.getLocations() != null && !user.getLocations().isEmpty()) {
            dto.setLocationIds(user.getLocations().stream()
                .map(Location::getId)
                .collect(Collectors.toList()));
            
            dto.setLocations(user.getLocations().stream()
                .map(LocationDto::fromEntity)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
}
