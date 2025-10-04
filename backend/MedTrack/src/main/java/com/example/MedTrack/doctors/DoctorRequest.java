package com.example.MedTrack.doctors;

import lombok.Data;

@Data
public class DoctorRequest {
    private String name;
    private String specialty;
    private String hospital;
    private String phone;
}
