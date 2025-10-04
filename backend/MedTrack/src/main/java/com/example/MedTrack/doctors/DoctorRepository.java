package com.example.MedTrack.doctors;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    List<Doctor> findBySpecialty(String specialty);
    
    List<Doctor> findByHospital(String hospital);
    
    @Query("SELECT d FROM Doctor d WHERE d.name LIKE %:name%")
    List<Doctor> findByNameContaining(@Param("name") String name);
    
    Optional<Doctor> findByNameAndHospital(String name, String hospital);
}
