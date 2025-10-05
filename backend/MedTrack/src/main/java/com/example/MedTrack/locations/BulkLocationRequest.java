package com.example.MedTrack.locations;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkLocationRequest {
    
    @NotEmpty(message = "At least one location is required")
    @Size(max = 50, message = "Cannot add more than 50 locations at once")
    @Valid
    private List<LocationRequest> locations;
}
