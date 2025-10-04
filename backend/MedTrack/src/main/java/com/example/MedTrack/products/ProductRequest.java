package com.example.MedTrack.products;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String category;
    private String manufacturer;
    private String description;
}
