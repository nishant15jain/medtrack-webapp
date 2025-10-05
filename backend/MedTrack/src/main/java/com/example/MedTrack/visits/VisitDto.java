package com.example.MedTrack.visits;

import com.example.MedTrack.doctors.DoctorDto;
import com.example.MedTrack.users.UserDto;
import com.example.MedTrack.locations.LocationDto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class VisitDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long doctorId;
    private String doctorName;
    private Long locationId;
    private String locationName;
    private LocalDate visitDate;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private VisitStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Nested objects for detailed information
    private DoctorDto doctor;
    private UserDto user;
    private LocationDto location;
}

