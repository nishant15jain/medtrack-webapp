package com.example.MedTrack.visits;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartVisitRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Location ID is required")
    private Long locationId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    private String notes;
}

