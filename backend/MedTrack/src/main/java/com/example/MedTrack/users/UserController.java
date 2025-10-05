package com.example.MedTrack.users;

import java.util.List;

import com.example.MedTrack.locations.LocationDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "API for managing users with role-based access control")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @Operation(summary = "Create a new user", description = "Creates a new user (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createUser(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(userService.createUser(registerRequest));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieves a specific user by their ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or (hasRole('REP') and @authenticationHelper.getCurrentUserId() == #id)")
    public ResponseEntity<UserDto> getUserById(
            @Parameter(description = "ID of the user to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieves a list of all users (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Get users by role", description = "Retrieves users filtered by role (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getUsersByRole(
            @Parameter(description = "Role to filter by") @PathVariable UserRole role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Updates an existing user's information (ADMIN and MANAGER)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserDto> updateUser(
            @Parameter(description = "ID of the user to update") @PathVariable Long id, 
            @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Deletes a user by their ID (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "ID of the user to delete") @PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate user", description = "Deactivates a user account (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> deactivateUser(
            @Parameter(description = "ID of the user to deactivate") @PathVariable Long id) {
        return ResponseEntity.ok(userService.deactivateUser(id));
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate user", description = "Activates a user account (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> activateUser(
            @Parameter(description = "ID of the user to activate") @PathVariable Long id) {
        return ResponseEntity.ok(userService.activateUser(id));
    }
    
    // Location management endpoints
    
    @PutMapping("/{id}/locations")
    @Operation(summary = "Assign locations to user", description = "Assigns multiple locations to a user (ADMIN and MANAGER)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserDto> assignLocationsToUser(
            @Parameter(description = "ID of the user") @PathVariable Long id,
            @RequestBody List<Long> locationIds) {
        return ResponseEntity.ok(userService.assignLocationsToUser(id, locationIds));
    }
    
    @PostMapping("/{id}/locations/{locationId}")
    @Operation(summary = "Add location to user", description = "Adds a single location to a user (ADMIN and MANAGER)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserDto> addLocationToUser(
            @Parameter(description = "ID of the user") @PathVariable Long id,
            @Parameter(description = "ID of the location to add") @PathVariable Long locationId) {
        return ResponseEntity.ok(userService.addLocationToUser(id, locationId));
    }
    
    @DeleteMapping("/{id}/locations/{locationId}")
    @Operation(summary = "Remove location from user", description = "Removes a location from a user (ADMIN and MANAGER)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserDto> removeLocationFromUser(
            @Parameter(description = "ID of the user") @PathVariable Long id,
            @Parameter(description = "ID of the location to remove") @PathVariable Long locationId) {
        return ResponseEntity.ok(userService.removeLocationFromUser(id, locationId));
    }
    
    @GetMapping("/{id}/locations")
    @Operation(summary = "Get user locations", description = "Retrieves all locations assigned to a user")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or (hasRole('REP') and @authenticationHelper.getCurrentUserId() == #id)")
    public ResponseEntity<List<LocationDto>> getUserLocations(
            @Parameter(description = "ID of the user") @PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserLocations(id));
    }
    
    @GetMapping("/by-location/{locationId}")
    @Operation(summary = "Get users by location", description = "Retrieves all users assigned to a specific location (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserDto>> getUsersByLocation(
            @Parameter(description = "ID of the location") @PathVariable Long locationId) {
        return ResponseEntity.ok(userService.getUsersByLocation(locationId));
    }
}
