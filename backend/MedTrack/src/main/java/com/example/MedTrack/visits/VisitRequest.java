package com.example.MedTrack.visits;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class VisitRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    private Long locationId;
    
    @NotNull(message = "Visit date is required")
    private LocalDate visitDate;
    
    private LocalDateTime checkInTime;
    
    private LocalDateTime checkOutTime;
    
    private VisitStatus status;
    
    private String notes;
}

