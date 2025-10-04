package com.example.MedTrack.products;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String category;
    private String manufacturer;
    private String description;
    private LocalDateTime createdAt;
}
