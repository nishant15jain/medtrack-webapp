package com.example.MedTrack.doctors;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.example.MedTrack.exceptions.ResourceNotFoundException;
import com.example.MedTrack.exceptions.BadRequestException;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;
    
    public DoctorService(DoctorRepository doctorRepository, DoctorMapper doctorMapper) {
        this.doctorRepository = doctorRepository;
        this.doctorMapper = doctorMapper;
    }

    public DoctorDto createDoctor(DoctorRequest request) {
        // Check if doctor with same name and hospital already exists
        doctorRepository.findByNameAndHospital(request.getName(), request.getHospital())
            .ifPresent(existingDoctor -> {
                throw new BadRequestException(
                    "Doctor with name '" + request.getName() + 
                    "' already exists at hospital '" + request.getHospital() + "'"
                );
            });
        
        Doctor doctor = doctorMapper.toEntity(request);
        Doctor savedDoctor = doctorRepository.save(doctor);
        return doctorMapper.toDto(savedDoctor);
    }

    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return doctorMapper.toDto(doctor);
    }

    public List<DoctorDto> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream()
            .map(doctorMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<DoctorDto> getDoctorsBySpecialty(String specialty) {
        List<Doctor> doctors = doctorRepository.findBySpecialty(specialty);
        return doctors.stream()
            .map(doctorMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<DoctorDto> getDoctorsByHospital(String hospital) {
        List<Doctor> doctors = doctorRepository.findByHospital(hospital);
        return doctors.stream()
            .map(doctorMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<DoctorDto> searchDoctorsByName(String name) {
        List<Doctor> doctors = doctorRepository.findByNameContaining(name);
        return doctors.stream()
            .map(doctorMapper::toDto)
            .collect(Collectors.toList());
    }

    public DoctorDto updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        
        doctor.setName(request.getName());
        doctor.setSpecialty(request.getSpecialty());
        doctor.setHospital(request.getHospital());
        doctor.setPhone(request.getPhone());
        
        Doctor updatedDoctor = doctorRepository.save(doctor);
        return doctorMapper.toDto(updatedDoctor);
    }

    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }
}
