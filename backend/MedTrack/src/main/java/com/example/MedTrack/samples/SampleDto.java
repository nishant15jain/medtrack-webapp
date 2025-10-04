package com.example.MedTrack.samples;

import com.example.MedTrack.doctors.DoctorDto;
import com.example.MedTrack.products.ProductDto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SampleDto {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private Long productId;
    private String productName;
    private Integer quantity;
    private LocalDate dateIssued;
    private Long visitId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Nested objects for detailed information
    private DoctorDto doctor;
    private ProductDto product;
}

