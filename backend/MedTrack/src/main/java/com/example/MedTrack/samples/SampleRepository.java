package com.example.MedTrack.samples;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SampleRepository extends JpaRepository<Sample, Long> {
    
    // Find sample by ID with doctor and product eagerly loaded
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product WHERE s.id = :id")
    Optional<Sample> findByIdWithAssociations(@Param("id") Long id);
    
    // Find all samples with doctor and product eagerly loaded
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product")
    List<Sample> findAllWithAssociations();
    
    // Find samples by doctor ID
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product WHERE s.doctor.id = :doctorId")
    List<Sample> findByDoctorId(@Param("doctorId") Long doctorId);
    
    // Find samples by product ID
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product WHERE s.product.id = :productId")
    List<Sample> findByProductId(@Param("productId") Long productId);
    
    // Find samples by visit ID
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product WHERE s.visit.id = :visitId")
    List<Sample> findByVisitId(@Param("visitId") Long visitId);
    
    // Find samples by doctor ID and date range
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product WHERE s.doctor.id = :doctorId AND s.dateIssued BETWEEN :startDate AND :endDate")
    List<Sample> findByDoctorIdAndDateRange(
        @Param("doctorId") Long doctorId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find samples by product ID and date range
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product WHERE s.product.id = :productId AND s.dateIssued BETWEEN :startDate AND :endDate")
    List<Sample> findByProductIdAndDateRange(
        @Param("productId") Long productId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find samples by date range
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product WHERE s.dateIssued BETWEEN :startDate AND :endDate")
    List<Sample> findByDateIssuedBetween(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find samples by specific date
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product WHERE s.dateIssued = :dateIssued")
    List<Sample> findByDateIssued(@Param("dateIssued") LocalDate dateIssued);
    
    // Get total quantity of samples issued for a product
    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Sample s WHERE s.product.id = :productId")
    Long getTotalQuantityByProductId(@Param("productId") Long productId);
    
    // Get total quantity of samples issued to a doctor
    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Sample s WHERE s.doctor.id = :doctorId")
    Long getTotalQuantityByDoctorId(@Param("doctorId") Long doctorId);
    
    // Get samples issued for a doctor and product combination
    @Query("SELECT s FROM Sample s LEFT JOIN FETCH s.doctor LEFT JOIN FETCH s.product WHERE s.doctor.id = :doctorId AND s.product.id = :productId")
    Optional<Sample> findByDoctorIdAndProductId(
        @Param("doctorId") Long doctorId,
        @Param("productId") Long productId
    );
    
    // Get top products by sample quantity
    @Query("SELECT s.product.id as productId, s.product.name as productName, " +
           "s.product.category as category, s.product.manufacturer as manufacturer, " +
           "SUM(s.quantity) as totalSamples " +
           "FROM Sample s " +
           "GROUP BY s.product.id, s.product.name, s.product.category, s.product.manufacturer " +
           "ORDER BY totalSamples DESC")
    List<Object[]> findTopProductsBySampleQuantity();
}

