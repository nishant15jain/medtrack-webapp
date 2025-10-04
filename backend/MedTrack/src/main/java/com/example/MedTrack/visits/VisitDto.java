package com.example.MedTrack.visits;

import com.example.MedTrack.doctors.DoctorDto;
import com.example.MedTrack.users.UserDto;
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
    private LocalDate visitDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Nested objects for detailed information
    private DoctorDto doctor;
    private UserDto user;
}

