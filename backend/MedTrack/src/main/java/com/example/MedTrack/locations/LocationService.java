package com.example.MedTrack.locations;

import com.example.MedTrack.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LocationService {
    
    private final LocationRepository locationRepository;
    
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }
    
    // Create a new location
    public LocationDto createLocation(LocationRequest request) {
        Location location = new Location();
        location.setName(request.getName());
        location.setCity(request.getCity());
        location.setState(request.getState());
        location.setCountry(request.getCountry() != null ? request.getCountry() : "India");
        location.setAddress(request.getAddress());
        location.setIsActive(true);
        
        Location savedLocation = locationRepository.save(location);
        return LocationDto.fromEntity(savedLocation);
    }
    
    // Create multiple locations in bulk
    public List<LocationDto> createBulkLocations(List<LocationRequest> locationRequests) {
        List<Location> locations = locationRequests.stream()
            .map(request -> {
                Location location = new Location();
                location.setName(request.getName());
                location.setCity(request.getCity());
                location.setState(request.getState());
                location.setCountry(request.getCountry() != null ? request.getCountry() : "India");
                location.setAddress(request.getAddress());
                location.setIsActive(true);
                return location;
            })
            .collect(Collectors.toList());
        
        List<Location> savedLocations = locationRepository.saveAll(locations);
        return savedLocations.stream()
            .map(LocationDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    // Get location by ID
    @Transactional(readOnly = true)
    public LocationDto getLocationById(Long id) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));
        return LocationDto.fromEntity(location);
    }
    
    // Get all locations
    @Transactional(readOnly = true)
    public List<LocationDto> getAllLocations() {
        return locationRepository.findAll().stream()
            .map(LocationDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    // Get all active locations
    @Transactional(readOnly = true)
    public List<LocationDto> getActiveLocations() {
        return locationRepository.findByIsActiveTrue().stream()
            .map(LocationDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    // Get locations by city
    @Transactional(readOnly = true)
    public List<LocationDto> getLocationsByCity(String city) {
        return locationRepository.findByCityIgnoreCase(city).stream()
            .map(LocationDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    // Search locations by name or city
    @Transactional(readOnly = true)
    public List<LocationDto> searchLocations(String searchTerm) {
        return locationRepository.searchLocations(searchTerm).stream()
            .map(LocationDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    // Search active locations by name or city
    @Transactional(readOnly = true)
    public List<LocationDto> searchActiveLocations(String searchTerm) {
        return locationRepository.searchActiveLocations(searchTerm).stream()
            .map(LocationDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    // Update location
    public LocationDto updateLocation(Long id, LocationRequest request) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));
        
        location.setName(request.getName());
        location.setCity(request.getCity());
        location.setState(request.getState());
        location.setCountry(request.getCountry());
        location.setAddress(request.getAddress());
        location.setUpdatedAt(LocalDateTime.now());
        
        Location updatedLocation = locationRepository.save(location);
        return LocationDto.fromEntity(updatedLocation);
    }
    
    // Activate location
    public LocationDto activateLocation(Long id) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));
        
        location.setIsActive(true);
        location.setUpdatedAt(LocalDateTime.now());
        
        Location updatedLocation = locationRepository.save(location);
        return LocationDto.fromEntity(updatedLocation);
    }
    
    // Deactivate location
    public LocationDto deactivateLocation(Long id) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));
        
        location.setIsActive(false);
        location.setUpdatedAt(LocalDateTime.now());
        
        Location updatedLocation = locationRepository.save(location);
        return LocationDto.fromEntity(updatedLocation);
    }
    
    // Delete location
    public void deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Location not found with id: " + id);
        }
        locationRepository.deleteById(id);
    }
    
    // Get location entity by ID (for internal use)
    @Transactional(readOnly = true)
    public Location getLocationEntityById(Long id) {
        return locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));
    }
}

