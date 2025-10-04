package com.example.MedTrack.samples;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/samples")
@Tag(name = "Samples", description = "API for managing product samples issued to doctors")
public class SampleController {
    private final SampleService sampleService;

    public SampleController(SampleService sampleService) {
        this.sampleService = sampleService;
    }

    @PostMapping
    @Operation(summary = "Issue a new sample", description = "Issues a product sample to a doctor (REP, MANAGER, ADMIN)")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<SampleDto> issueSample(@Valid @RequestBody SampleRequest sampleRequest) {
        return ResponseEntity.ok(sampleService.issueSample(sampleRequest));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sample by ID", description = "Retrieves a specific sample by its ID")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<SampleDto> getSampleById(
            @Parameter(description = "ID of the sample to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(sampleService.getSampleById(id));
    }

    @GetMapping
    @Operation(summary = "Get all samples", description = "Retrieves a list of all samples (MANAGER, ADMIN)")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<List<SampleDto>> getAllSamples() {
        return ResponseEntity.ok(sampleService.getAllSamples());
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get samples by doctor ID", description = "Retrieves all samples issued to a specific doctor")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<SampleDto>> getSamplesByDoctorId(
            @Parameter(description = "Doctor ID to filter by") @PathVariable Long doctorId) {
        return ResponseEntity.ok(sampleService.getSamplesByDoctorId(doctorId));
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get samples by product ID", description = "Retrieves all samples for a specific product")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<SampleDto>> getSamplesByProductId(
            @Parameter(description = "Product ID to filter by") @PathVariable Long productId) {
        return ResponseEntity.ok(sampleService.getSamplesByProductId(productId));
    }

    @GetMapping("/visit/{visitId}")
    @Operation(summary = "Get samples by visit ID", description = "Retrieves all samples issued during a specific visit")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<SampleDto>> getSamplesByVisitId(
            @Parameter(description = "Visit ID to filter by") @PathVariable Long visitId) {
        return ResponseEntity.ok(sampleService.getSamplesByVisitId(visitId));
    }

    @GetMapping("/doctor/{doctorId}/date-range")
    @Operation(summary = "Get samples by doctor and date range", description = "Retrieves samples issued to a doctor within a date range")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<SampleDto>> getSamplesByDoctorIdAndDateRange(
            @Parameter(description = "Doctor ID to filter by") @PathVariable Long doctorId,
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(sampleService.getSamplesByDoctorIdAndDateRange(doctorId, startDate, endDate));
    }

    @GetMapping("/product/{productId}/date-range")
    @Operation(summary = "Get samples by product and date range", description = "Retrieves samples for a product within a date range")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<SampleDto>> getSamplesByProductIdAndDateRange(
            @Parameter(description = "Product ID to filter by") @PathVariable Long productId,
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(sampleService.getSamplesByProductIdAndDateRange(productId, startDate, endDate));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get samples by date range", description = "Retrieves all samples within a date range")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<List<SampleDto>> getSamplesByDateRange(
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(sampleService.getSamplesByDateRange(startDate, endDate));
    }

    @GetMapping("/date/{dateIssued}")
    @Operation(summary = "Get samples by specific date", description = "Retrieves all samples issued on a specific date")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<List<SampleDto>> getSamplesByDate(
            @Parameter(description = "Date issued (YYYY-MM-DD)") @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateIssued) {
        return ResponseEntity.ok(sampleService.getSamplesByDate(dateIssued));
    }

    @GetMapping("/doctor/{doctorId}/product/{productId}")
    @Operation(summary = "Get samples by doctor and product", description = "Retrieves all samples for a specific doctor and product combination")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<SampleDto>> getSamplesByDoctorIdAndProductId(
            @Parameter(description = "Doctor ID to filter by") @PathVariable Long doctorId,
            @Parameter(description = "Product ID to filter by") @PathVariable Long productId) {
        return ResponseEntity.ok(sampleService.getSamplesByDoctorIdAndProductId(doctorId, productId));
    }

    @GetMapping("/reports/product/{productId}/total-quantity")
    @Operation(summary = "Get total quantity by product", description = "Retrieves the total quantity of samples issued for a specific product")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<Long> getTotalQuantityByProductId(
            @Parameter(description = "Product ID") @PathVariable Long productId) {
        return ResponseEntity.ok(sampleService.getTotalQuantityByProductId(productId));
    }

    @GetMapping("/reports/doctor/{doctorId}/total-quantity")
    @Operation(summary = "Get total quantity by doctor", description = "Retrieves the total quantity of samples issued to a specific doctor")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<Long> getTotalQuantityByDoctorId(
            @Parameter(description = "Doctor ID") @PathVariable Long doctorId) {
        return ResponseEntity.ok(sampleService.getTotalQuantityByDoctorId(doctorId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update sample", description = "Updates an existing sample's information")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<SampleDto> updateSample(
            @Parameter(description = "ID of the sample to update") @PathVariable Long id, 
            @Valid @RequestBody SampleRequest sampleRequest) {
        return ResponseEntity.ok(sampleService.updateSample(id, sampleRequest));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete sample", description = "Deletes a sample by its ID")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('REP')")
    public ResponseEntity<Void> deleteSample(
            @Parameter(description = "ID of the sample to delete") @PathVariable Long id) {
        sampleService.deleteSample(id);
        return ResponseEntity.noContent().build();
    }
}

