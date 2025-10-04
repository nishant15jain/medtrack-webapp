package com.example.MedTrack.orders;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {
    
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "doctor.name", target = "doctorName")
    @Mapping(source = "doctor.specialty", target = "doctorSpecialty")
    @Mapping(source = "doctor.hospital", target = "doctorHospital")
    @Mapping(source = "visit.id", target = "visitId")
    @Mapping(source = "visit.visitDate", target = "visitDate")
    @Mapping(source = "orderItems", target = "orderItems")
    OrderDto toDto(Order order);
}

