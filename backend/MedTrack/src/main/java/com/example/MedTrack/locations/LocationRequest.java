package com.example.MedTrack.locations;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationRequest {
    
    @NotBlank(message = "Location name is required")
    private String name;
    
    @NotBlank(message = "City is required")
    private String city;
    
    private String state;
    
    private String country = "India";
    
    private String address;
}

