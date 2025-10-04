package com.example.MedTrack.visits;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.example.MedTrack.exceptions.ResourceNotFoundException;
import com.example.MedTrack.exceptions.BadRequestException;
import com.example.MedTrack.users.User;
import com.example.MedTrack.users.UserRepository;
import com.example.MedTrack.doctors.Doctor;
import com.example.MedTrack.doctors.DoctorRepository;

@Service
public class VisitService {
    private final VisitRepository visitRepository;
    private final VisitMapper visitMapper;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    
    public VisitService(VisitRepository visitRepository, VisitMapper visitMapper,
                       UserRepository userRepository, DoctorRepository doctorRepository) {
        this.visitRepository = visitRepository;
        this.visitMapper = visitMapper;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    public VisitDto createVisit(VisitRequest request) {
        // Validate user exists
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        // Validate doctor exists
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));
        
        // Validate visit date is not in the future
        if (request.getVisitDate().isAfter(LocalDate.now())) {
            throw new BadRequestException("Visit date cannot be in the future");
        }
        
        Visit visit = new Visit();
        visit.setUser(user);
        visit.setDoctor(doctor);
        visit.setVisitDate(request.getVisitDate());
        visit.setNotes(request.getNotes());
        
        Visit savedVisit = visitRepository.save(visit);
        // Fetch the saved visit with associations to ensure all data is loaded for the DTO
        Visit visitWithAssociations = visitRepository.findByIdWithAssociations(savedVisit.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Visit not found after save"));
        return visitMapper.toDto(visitWithAssociations);
    }

    public VisitDto getVisitById(Long id) {
        Visit visit = visitRepository.findByIdWithAssociations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Visit not found with id: " + id));
        return visitMapper.toDto(visit);
    }

    public List<VisitDto> getAllVisits() {
        List<Visit> visits = visitRepository.findAllWithAssociations();
        return visits.stream()
            .map(visitMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<VisitDto> getVisitsByUserId(Long userId) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        
        List<Visit> visits = visitRepository.findByUserId(userId);
        return visits.stream()
            .map(visitMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<VisitDto> getVisitsByDoctorId(Long doctorId) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        
        List<Visit> visits = visitRepository.findByDoctorId(doctorId);
        return visits.stream()
            .map(visitMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<VisitDto> getVisitsByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        
        List<Visit> visits = visitRepository.findByUserIdAndDateRange(userId, startDate, endDate);
        return visits.stream()
            .map(visitMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<VisitDto> getVisitsByDoctorIdAndDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        
        List<Visit> visits = visitRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
        return visits.stream()
            .map(visitMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<VisitDto> getVisitsByDateRange(LocalDate startDate, LocalDate endDate) {
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        
        List<Visit> visits = visitRepository.findByVisitDateBetween(startDate, endDate);
        return visits.stream()
            .map(visitMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<VisitDto> getVisitsByDate(LocalDate visitDate) {
        List<Visit> visits = visitRepository.findByVisitDate(visitDate);
        return visits.stream()
            .map(visitMapper::toDto)
            .collect(Collectors.toList());
    }

    public VisitDto updateVisit(Long id, VisitRequest request) {
        Visit visit = visitRepository.findByIdWithAssociations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Visit not found with id: " + id));
        
        // Validate user exists if user is being updated
        if (request.getUserId() != null && !request.getUserId().equals(visit.getUser().getId())) {
            User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
            visit.setUser(user);
        }
        
        // Validate doctor exists if doctor is being updated
        if (request.getDoctorId() != null && !request.getDoctorId().equals(visit.getDoctor().getId())) {
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));
            visit.setDoctor(doctor);
        }
        
        // Validate visit date is not in the future
        if (request.getVisitDate() != null && request.getVisitDate().isAfter(LocalDate.now())) {
            throw new BadRequestException("Visit date cannot be in the future");
        }
        
        if (request.getVisitDate() != null) {
            visit.setVisitDate(request.getVisitDate());
        }
        if (request.getNotes() != null) {
            visit.setNotes(request.getNotes());
        }
        
        Visit updatedVisit = visitRepository.save(visit);
        // Fetch the updated visit with associations to ensure all data is loaded for the DTO
        Visit visitWithAssociations = visitRepository.findByIdWithAssociations(updatedVisit.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Visit not found after update"));
        return visitMapper.toDto(visitWithAssociations);
    }

    public void deleteVisit(Long id) {
        if (!visitRepository.existsById(id)) {
            throw new ResourceNotFoundException("Visit not found with id: " + id);
        }
        visitRepository.deleteById(id);
    }
}

