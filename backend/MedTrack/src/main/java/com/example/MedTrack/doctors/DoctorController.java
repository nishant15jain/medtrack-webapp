package com.example.MedTrack.doctors;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/doctors")
@Tag(name = "Doctors", description = "API for managing doctors and medical professionals")
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    @Operation(summary = "Create a new doctor", description = "Creates a new doctor record (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorDto> createDoctor(@RequestBody DoctorRequest doctorRequest) {
        return ResponseEntity.ok(doctorService.createDoctor(doctorRequest));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor by ID", description = "Retrieves a specific doctor by their ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<DoctorDto> getDoctorById(
            @Parameter(description = "ID of the doctor to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping
    @Operation(summary = "Get all doctors", description = "Retrieves a list of all doctors")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/specialty/{specialty}")
    @Operation(summary = "Get doctors by specialty", description = "Retrieves doctors filtered by medical specialty")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<List<DoctorDto>> getDoctorsBySpecialty(
            @Parameter(description = "Medical specialty to filter by") @PathVariable String specialty) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialty(specialty));
    }

    @GetMapping("/hospital/{hospital}")
    @Operation(summary = "Get doctors by hospital", description = "Retrieves doctors filtered by hospital")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<List<DoctorDto>> getDoctorsByHospital(
            @Parameter(description = "Hospital name to filter by") @PathVariable String hospital) {
        return ResponseEntity.ok(doctorService.getDoctorsByHospital(hospital));
    }

    @GetMapping("/search")
    @Operation(summary = "Search doctors by name", description = "Searches for doctors by name (partial match)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<List<DoctorDto>> searchDoctorsByName(
            @Parameter(description = "Name to search for") @RequestParam String name) {
        return ResponseEntity.ok(doctorService.searchDoctorsByName(name));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update doctor", description = "Updates an existing doctor's information (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorDto> updateDoctor(
            @Parameter(description = "ID of the doctor to update") @PathVariable Long id, 
            @RequestBody DoctorRequest doctorRequest) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, doctorRequest));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete doctor", description = "Deletes a doctor by their ID (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDoctor(
            @Parameter(description = "ID of the doctor to delete") @PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
