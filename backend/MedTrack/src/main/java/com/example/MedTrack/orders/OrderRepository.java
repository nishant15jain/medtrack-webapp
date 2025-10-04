package com.example.MedTrack.orders;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find order by ID with all associations eagerly loaded
    @Query("SELECT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.visit v " +
           "LEFT JOIN FETCH v.user " +
           "LEFT JOIN FETCH o.orderItems oi " +
           "LEFT JOIN FETCH oi.product " +
           "WHERE o.id = :id")
    Optional<Order> findByIdWithAssociations(@Param("id") Long id);
    
    // Find all orders with associations eagerly loaded
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.visit " +
           "LEFT JOIN FETCH o.orderItems")
    List<Order> findAllWithAssociations();
    
    // Find orders by doctor ID
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.orderItems " +
           "WHERE o.doctor.id = :doctorId")
    List<Order> findByDoctorId(@Param("doctorId") Long doctorId);
    
    // Find orders by visit ID
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.visit " +
           "LEFT JOIN FETCH o.orderItems " +
           "WHERE o.visit.id = :visitId")
    List<Order> findByVisitId(@Param("visitId") Long visitId);
    
    // Find orders by status
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.orderItems " +
           "WHERE o.status = :status")
    List<Order> findByStatus(@Param("status") OrderStatus status);
    
    // Find orders by payment status
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.orderItems " +
           "WHERE o.paymentStatus = :paymentStatus")
    List<Order> findByPaymentStatus(@Param("paymentStatus") PaymentStatus paymentStatus);
    
    // Find orders by order date
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.orderItems " +
           "WHERE o.orderDate = :orderDate")
    List<Order> findByOrderDate(@Param("orderDate") LocalDate orderDate);
    
    // Find orders by date range
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.orderItems " +
           "WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByOrderDateBetween(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find orders by doctor and date range
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.orderItems " +
           "WHERE o.doctor.id = :doctorId AND o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByDoctorIdAndOrderDateBetween(
        @Param("doctorId") Long doctorId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find by order number
    @Query("SELECT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.orderItems " +
           "WHERE o.orderNumber = :orderNumber")
    Optional<Order> findByOrderNumber(@Param("orderNumber") String orderNumber);
    
    // Get total revenue (sum of all order amounts where status is not CANCELLED)
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal getTotalRevenue();
    
    // Get total revenue by doctor
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.doctor.id = :doctorId AND o.status != 'CANCELLED'")
    BigDecimal getTotalRevenueByDoctorId(@Param("doctorId") Long doctorId);
    
    // Get total revenue by date range
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.orderDate BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'")
    BigDecimal getTotalRevenueByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Count orders by status
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") OrderStatus status);
    
    // Get orders by doctor and status
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.orderItems " +
           "WHERE o.doctor.id = :doctorId AND o.status = :status")
    List<Order> findByDoctorIdAndStatus(
        @Param("doctorId") Long doctorId,
        @Param("status") OrderStatus status
    );
    
    // Get recent orders
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.doctor " +
           "LEFT JOIN FETCH o.orderItems " +
           "ORDER BY o.orderDate DESC, o.createdAt DESC")
    List<Order> findRecentOrders();
}

