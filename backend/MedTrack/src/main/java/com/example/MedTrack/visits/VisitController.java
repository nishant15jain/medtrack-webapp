package com.example.MedTrack.visits;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/visits")
@Tag(name = "Visits", description = "API for managing doctor visits by sales representatives")
public class VisitController {
    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PostMapping
    @Operation(summary = "Create a new visit", description = "Creates a new visit record (REP, MANAGER, ADMIN)")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<VisitDto> createVisit(@Valid @RequestBody VisitRequest visitRequest) {
        return ResponseEntity.ok(visitService.createVisit(visitRequest));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get visit by ID", description = "Retrieves a specific visit by its ID")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<VisitDto> getVisitById(
            @Parameter(description = "ID of the visit to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(visitService.getVisitById(id));
    }

    @GetMapping
    @Operation(summary = "Get all visits", description = "Retrieves a list of all visits (MANAGER, ADMIN)")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<List<VisitDto>> getAllVisits(Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        Long userId = Long.parseLong(authentication.getName()); // assuming username = userId
    
        if (role.equals("ROLE_REP")) {
            // REP → only their own visits
            return ResponseEntity.ok(visitService.getVisitsByUserId(userId));
        } else {
            // MANAGER/ADMIN → see everything
            return ResponseEntity.ok(visitService.getAllVisits());
        }
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get visits by user ID", description = "Retrieves all visits for a specific user/rep")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<VisitDto>> getVisitsByUserId(
            @Parameter(description = "User ID to filter by") @PathVariable Long userId) {
        return ResponseEntity.ok(visitService.getVisitsByUserId(userId));
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get visits by doctor ID", description = "Retrieves all visits for a specific doctor")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<VisitDto>> getVisitsByDoctorId(
            @Parameter(description = "Doctor ID to filter by") @PathVariable Long doctorId) {
        return ResponseEntity.ok(visitService.getVisitsByDoctorId(doctorId));
    }

    @GetMapping("/user/{userId}/date-range")
    @Operation(summary = "Get visits by user and date range", description = "Retrieves visits for a user within a date range")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<VisitDto>> getVisitsByUserIdAndDateRange(
            @Parameter(description = "User ID to filter by") @PathVariable Long userId,
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(visitService.getVisitsByUserIdAndDateRange(userId, startDate, endDate));
    }

    @GetMapping("/doctor/{doctorId}/date-range")
    @Operation(summary = "Get visits by doctor and date range", description = "Retrieves visits for a doctor within a date range")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<VisitDto>> getVisitsByDoctorIdAndDateRange(
            @Parameter(description = "Doctor ID to filter by") @PathVariable Long doctorId,
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(visitService.getVisitsByDoctorIdAndDateRange(doctorId, startDate, endDate));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get visits by date range", description = "Retrieves all visits within a date range")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<List<VisitDto>> getVisitsByDateRange(
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(visitService.getVisitsByDateRange(startDate, endDate));
    }

    @GetMapping("/date/{visitDate}")
    @Operation(summary = "Get visits by specific date", description = "Retrieves all visits on a specific date")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<List<VisitDto>> getVisitsByDate(
            @Parameter(description = "Visit date (YYYY-MM-DD)") @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate visitDate) {
        return ResponseEntity.ok(visitService.getVisitsByDate(visitDate));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update visit", description = "Updates an existing visit's information")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<VisitDto> updateVisit(
            @Parameter(description = "ID of the visit to update") @PathVariable Long id, 
            @Valid @RequestBody VisitRequest visitRequest) {
        return ResponseEntity.ok(visitService.updateVisit(id, visitRequest));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete visit", description = "Deletes a visit by its ID")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<Void> deleteVisit(
            @Parameter(description = "ID of the visit to delete") @PathVariable Long id) {
        visitService.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/start")
    @Operation(summary = "Start a new visit", description = "Starts a new visit with check-in time (REP, MANAGER, ADMIN)")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<VisitDto> startVisit(@Valid @RequestBody StartVisitRequest request) {
        return ResponseEntity.ok(visitService.startVisit(
            request.getUserId(), 
            request.getLocationId(), 
            request.getDoctorId(), 
            request.getNotes()
        ));
    }
    
    @PutMapping("/{id}/end")
    @Operation(summary = "End a visit", description = "Ends an active visit with check-out time")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<VisitDto> endVisit(
            @Parameter(description = "ID of the visit to end") @PathVariable Long id,
            @RequestBody(required = false) EndVisitRequest request) {
        String notes = request != null ? request.getNotes() : null;
        return ResponseEntity.ok(visitService.endVisit(id, notes));
    }
    
    @GetMapping("/location/{locationId}")
    @Operation(summary = "Get visits by location", description = "Retrieves all visits for a specific location")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<VisitDto>> getVisitsByLocation(
            @Parameter(description = "Location ID to filter by") @PathVariable Long locationId) {
        return ResponseEntity.ok(visitService.getVisitsByLocation(locationId));
    }
    
    @GetMapping("/user/{userId}/active")
    @Operation(summary = "Get active visits by user", description = "Retrieves all in-progress visits for a user")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<VisitDto>> getActiveVisitsByUser(
            @Parameter(description = "User ID to filter by") @PathVariable Long userId) {
        return ResponseEntity.ok(visitService.getActiveVisitsByUser(userId));
    }
}

