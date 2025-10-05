package com.example.MedTrack.locations;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@Tag(name = "Locations", description = "API for managing locations")
public class LocationController {
    
    private final LocationService locationService;
    
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }
    
    @PostMapping
    @Operation(summary = "Create a new location", description = "Creates a new location (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LocationDto> createLocation(@Valid @RequestBody LocationRequest request) {
        return ResponseEntity.ok(locationService.createLocation(request));
    }
    
    @PostMapping("/bulk")
    @Operation(summary = "Create multiple locations", description = "Creates multiple locations in bulk (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LocationDto>> createBulkLocations(@Valid @RequestBody BulkLocationRequest request) {
        return ResponseEntity.ok(locationService.createBulkLocations(request.getLocations()));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get location by ID", description = "Retrieves a specific location by its ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<LocationDto> getLocationById(
            @Parameter(description = "ID of the location to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(locationService.getLocationById(id));
    }
    
    @GetMapping
    @Operation(summary = "Get all locations", description = "Retrieves a list of all locations")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<List<LocationDto>> getAllLocations(
            @Parameter(description = "Filter only active locations") @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        if (activeOnly) {
            return ResponseEntity.ok(locationService.getActiveLocations());
        }
        return ResponseEntity.ok(locationService.getAllLocations());
    }
    
    @GetMapping("/city/{city}")
    @Operation(summary = "Get locations by city", description = "Retrieves locations filtered by city")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<List<LocationDto>> getLocationsByCity(
            @Parameter(description = "City name to filter by") @PathVariable String city) {
        return ResponseEntity.ok(locationService.getLocationsByCity(city));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search locations", description = "Search locations by name or city")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<List<LocationDto>> searchLocations(
            @Parameter(description = "Search term") @RequestParam String q,
            @Parameter(description = "Filter only active locations") @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        if (activeOnly) {
            return ResponseEntity.ok(locationService.searchActiveLocations(q));
        }
        return ResponseEntity.ok(locationService.searchLocations(q));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update location", description = "Updates an existing location's information (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LocationDto> updateLocation(
            @Parameter(description = "ID of the location to update") @PathVariable Long id,
            @Valid @RequestBody LocationRequest request) {
        return ResponseEntity.ok(locationService.updateLocation(id, request));
    }
    
    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate location", description = "Activates a location (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LocationDto> activateLocation(
            @Parameter(description = "ID of the location to activate") @PathVariable Long id) {
        return ResponseEntity.ok(locationService.activateLocation(id));
    }
    
    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate location", description = "Deactivates a location (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LocationDto> deactivateLocation(
            @Parameter(description = "ID of the location to deactivate") @PathVariable Long id) {
        return ResponseEntity.ok(locationService.deactivateLocation(id));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete location", description = "Deletes a location by its ID (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLocation(
            @Parameter(description = "ID of the location to delete") @PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
}

