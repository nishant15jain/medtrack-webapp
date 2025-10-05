package com.example.MedTrack.locations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    
    // Find all active locations
    List<Location> findByIsActiveTrue();
    
    // Find by city
    List<Location> findByCityIgnoreCase(String city);
    
    // Find by name (case-insensitive)
    Optional<Location> findByNameIgnoreCase(String name);
    
    // Find by city and active status
    List<Location> findByCityIgnoreCaseAndIsActive(String city, Boolean isActive);
    
    // Search locations by name or city
    @Query("SELECT l FROM Location l WHERE " +
           "LOWER(l.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.city) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Location> searchLocations(@Param("searchTerm") String searchTerm);
    
    // Find active locations by name or city
    @Query("SELECT l FROM Location l WHERE l.isActive = true AND " +
           "(LOWER(l.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Location> searchActiveLocations(@Param("searchTerm") String searchTerm);
}

