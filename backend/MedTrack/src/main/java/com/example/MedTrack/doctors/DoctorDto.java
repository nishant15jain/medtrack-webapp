package com.example.MedTrack.doctors;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DoctorDto {
    private Long id;
    private String name;
    private String specialty;
    private String hospital;
    private String phone;
    private LocalDateTime createdAt;
}
