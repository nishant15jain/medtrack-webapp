package com.example.MedTrack.doctors;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    DoctorDto toDto(Doctor doctor);
    Doctor toEntity(DoctorRequest request);
    void updateEntity(DoctorDto doctorDto, @MappingTarget Doctor doctor);
}
