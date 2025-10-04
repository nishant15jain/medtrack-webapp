package com.example.MedTrack.visits;

import com.example.MedTrack.doctors.DoctorMapper;
import com.example.MedTrack.users.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {DoctorMapper.class, UserMapper.class})
public interface VisitMapper {
    
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.name", target = "userName")
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "doctor.name", target = "doctorName")
    @Mapping(source = "user", target = "user")
    @Mapping(source = "doctor", target = "doctor")
    VisitDto toDto(Visit visit);
}

