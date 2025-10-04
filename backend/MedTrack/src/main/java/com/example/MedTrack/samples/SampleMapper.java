package com.example.MedTrack.samples;

import com.example.MedTrack.doctors.DoctorMapper;
import com.example.MedTrack.products.ProductMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {DoctorMapper.class, ProductMapper.class})
public interface SampleMapper {
    
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "doctor.name", target = "doctorName")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "visit.id", target = "visitId")
    @Mapping(source = "doctor", target = "doctor")
    @Mapping(source = "product", target = "product")
    SampleDto toDto(Sample sample);
}

