package com.example.MedTrack.visits;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VisitRepository extends JpaRepository<Visit, Long> {
    
    // Find visit by ID with user, doctor, and location eagerly loaded
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.id = :id")
    Optional<Visit> findByIdWithAssociations(@Param("id") Long id);
    
    // Find all visits with user, doctor, and location eagerly loaded
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location")
    List<Visit> findAllWithAssociations();
    
    // Find visits by user ID
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.user.id = :userId")
    List<Visit> findByUserId(@Param("userId") Long userId);
    
    // Find visits by doctor ID
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.doctor.id = :doctorId")
    List<Visit> findByDoctorId(@Param("doctorId") Long doctorId);
    
    // Find visits by user ID and date range
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.user.id = :userId AND v.visitDate BETWEEN :startDate AND :endDate")
    List<Visit> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find visits by doctor ID and date range
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.doctor.id = :doctorId AND v.visitDate BETWEEN :startDate AND :endDate")
    List<Visit> findByDoctorIdAndDateRange(
        @Param("doctorId") Long doctorId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find visits by date range
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.visitDate BETWEEN :startDate AND :endDate")
    List<Visit> findByVisitDateBetween(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find visits by specific date
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.visitDate = :visitDate")
    List<Visit> findByVisitDate(@Param("visitDate") LocalDate visitDate);
    
    // Count distinct active users (REPs) who made visits in a date range
    @Query("SELECT COUNT(DISTINCT v.user.id) FROM Visit v WHERE v.visitDate BETWEEN :startDate AND :endDate")
    Long countDistinctUsersByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find visits by location ID
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.location.id = :locationId")
    List<Visit> findByLocationId(@Param("locationId") Long locationId);
    
    // Find visits by user ID and status
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.user.id = :userId AND v.status = :status")
    List<Visit> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") VisitStatus status);
    
    // Find visits by status
    @Query("SELECT v FROM Visit v LEFT JOIN FETCH v.user LEFT JOIN FETCH v.doctor LEFT JOIN FETCH v.location WHERE v.status = :status")
    List<Visit> findByStatus(@Param("status") VisitStatus status);
}

