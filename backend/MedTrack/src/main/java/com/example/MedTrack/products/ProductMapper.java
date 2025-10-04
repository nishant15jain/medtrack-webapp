package com.example.MedTrack.products;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDto toDto(Product product);
    Product toEntity(ProductRequest request);
    void updateEntity(ProductDto productDto, @MappingTarget Product product);
}
