package com.example.MedTrack.samples;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.example.MedTrack.exceptions.ResourceNotFoundException;
import com.example.MedTrack.exceptions.BadRequestException;
import com.example.MedTrack.doctors.Doctor;
import com.example.MedTrack.doctors.DoctorRepository;
import com.example.MedTrack.products.Product;
import com.example.MedTrack.products.ProductRepository;
import com.example.MedTrack.visits.Visit;
import com.example.MedTrack.visits.VisitRepository;

@Service
public class SampleService {
    private final SampleRepository sampleRepository;
    private final SampleMapper sampleMapper;
    private final DoctorRepository doctorRepository;
    private final ProductRepository productRepository;
    private final VisitRepository visitRepository;
    
    public SampleService(SampleRepository sampleRepository, SampleMapper sampleMapper,
                        DoctorRepository doctorRepository, ProductRepository productRepository,
                        VisitRepository visitRepository) {
        this.sampleRepository = sampleRepository;
        this.sampleMapper = sampleMapper;
        this.doctorRepository = doctorRepository;
        this.productRepository = productRepository;
        this.visitRepository = visitRepository;
    }

    public SampleDto issueSample(SampleRequest request) {
        // Check if sample with same doctor and product already exists
        if (sampleRepository.findByDoctorIdAndProductId(request.getDoctorId(), request.getProductId()).isPresent()) {
            throw new BadRequestException("Sample with doctor id '" + request.getDoctorId() + 
                "' and product id '" + request.getProductId() + "' already exists");
        }
        
        // Validate doctor exists
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));
        
        // Validate product exists
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));
        
        // Validate visit exists if provided
        Visit visit = null;
        if (request.getVisitId() != null) {
            visit = visitRepository.findById(request.getVisitId())
                .orElseThrow(() -> new ResourceNotFoundException("Visit not found with id: " + request.getVisitId()));
            
            // Validate that the visit is for the same doctor
            if (!visit.getDoctor().getId().equals(request.getDoctorId())) {
                throw new BadRequestException("Visit does not belong to the specified doctor");
            }
        }
        
        // Validate date issued is not in the future
        if (request.getDateIssued().isAfter(LocalDate.now())) {
            throw new BadRequestException("Date issued cannot be in the future");
        }
        
        Sample sample = new Sample();
        sample.setDoctor(doctor);
        sample.setProduct(product);
        sample.setQuantity(request.getQuantity());
        sample.setDateIssued(request.getDateIssued());
        sample.setVisit(visit);
        
        Sample savedSample = sampleRepository.save(sample);
        // Fetch the saved sample with associations to ensure all data is loaded for the DTO
        Sample sampleWithAssociations = sampleRepository.findByIdWithAssociations(savedSample.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Sample not found after save"));
        return sampleMapper.toDto(sampleWithAssociations);
    }

    public SampleDto getSampleById(Long id) {
        Sample sample = sampleRepository.findByIdWithAssociations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sample not found with id: " + id));
        return sampleMapper.toDto(sample);
    }

    public List<SampleDto> getAllSamples() {
        List<Sample> samples = sampleRepository.findAllWithAssociations();
        return samples.stream()
            .map(sampleMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<SampleDto> getSamplesByDoctorId(Long doctorId) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        
        List<Sample> samples = sampleRepository.findByDoctorId(doctorId);
        return samples.stream()
            .map(sampleMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<SampleDto> getSamplesByProductId(Long productId) {
        // Validate product exists
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        
        List<Sample> samples = sampleRepository.findByProductId(productId);
        return samples.stream()
            .map(sampleMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<SampleDto> getSamplesByVisitId(Long visitId) {
        // Validate visit exists
        if (!visitRepository.existsById(visitId)) {
            throw new ResourceNotFoundException("Visit not found with id: " + visitId);
        }
        
        List<Sample> samples = sampleRepository.findByVisitId(visitId);
        return samples.stream()
            .map(sampleMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<SampleDto> getSamplesByDoctorIdAndDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        
        List<Sample> samples = sampleRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
        return samples.stream()
            .map(sampleMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<SampleDto> getSamplesByProductIdAndDateRange(Long productId, LocalDate startDate, LocalDate endDate) {
        // Validate product exists
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        
        List<Sample> samples = sampleRepository.findByProductIdAndDateRange(productId, startDate, endDate);
        return samples.stream()
            .map(sampleMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<SampleDto> getSamplesByDateRange(LocalDate startDate, LocalDate endDate) {
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        
        List<Sample> samples = sampleRepository.findByDateIssuedBetween(startDate, endDate);
        return samples.stream()
            .map(sampleMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<SampleDto> getSamplesByDate(LocalDate dateIssued) {
        List<Sample> samples = sampleRepository.findByDateIssued(dateIssued);
        return samples.stream()
            .map(sampleMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<SampleDto> getSamplesByDoctorIdAndProductId(Long doctorId, Long productId) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        
        // Validate product exists
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        
        Optional<Sample> sample = sampleRepository.findByDoctorIdAndProductId(doctorId, productId);
        return sample.stream()
            .map(sampleMapper::toDto)
            .collect(Collectors.toList());
    }

    public Long getTotalQuantityByProductId(Long productId) {
        // Validate product exists
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        
        return sampleRepository.getTotalQuantityByProductId(productId);
    }

    public Long getTotalQuantityByDoctorId(Long doctorId) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        
        return sampleRepository.getTotalQuantityByDoctorId(doctorId);
    }

    public SampleDto updateSample(Long id, SampleRequest request) {
        Sample sample = sampleRepository.findByIdWithAssociations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sample not found with id: " + id));
        
        // Validate doctor exists if doctor is being updated
        if (request.getDoctorId() != null && !request.getDoctorId().equals(sample.getDoctor().getId())) {
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));
            sample.setDoctor(doctor);
        }
        
        // Validate product exists if product is being updated
        if (request.getProductId() != null && !request.getProductId().equals(sample.getProduct().getId())) {
            Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));
            sample.setProduct(product);
        }
        
        // Validate visit exists if visit is being updated
        if (request.getVisitId() != null) {
            Visit visit = visitRepository.findById(request.getVisitId())
                .orElseThrow(() -> new ResourceNotFoundException("Visit not found with id: " + request.getVisitId()));
            
            // Validate that the visit is for the same doctor
            Long doctorId = request.getDoctorId() != null ? request.getDoctorId() : sample.getDoctor().getId();
            if (!visit.getDoctor().getId().equals(doctorId)) {
                throw new BadRequestException("Visit does not belong to the specified doctor");
            }
            sample.setVisit(visit);
        }
        
        // Validate date issued is not in the future
        if (request.getDateIssued() != null && request.getDateIssued().isAfter(LocalDate.now())) {
            throw new BadRequestException("Date issued cannot be in the future");
        }
        
        if (request.getQuantity() != null) {
            sample.setQuantity(request.getQuantity());
        }
        if (request.getDateIssued() != null) {
            sample.setDateIssued(request.getDateIssued());
        }
        
        Sample updatedSample = sampleRepository.save(sample);
        // Fetch the updated sample with associations to ensure all data is loaded for the DTO
        Sample sampleWithAssociations = sampleRepository.findByIdWithAssociations(updatedSample.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Sample not found after update"));
        return sampleMapper.toDto(sampleWithAssociations);
    }

    public void deleteSample(Long id) {
        if (!sampleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sample not found with id: " + id);
        }
        sampleRepository.deleteById(id);
    }
}

