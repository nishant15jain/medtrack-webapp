package com.example.MedTrack.orders;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Find order items by order ID
    @Query("SELECT oi FROM OrderItem oi " +
           "LEFT JOIN FETCH oi.product " +
           "WHERE oi.order.id = :orderId")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
    
    // Find order items by product ID
    @Query("SELECT oi FROM OrderItem oi " +
           "LEFT JOIN FETCH oi.order o " +
           "LEFT JOIN FETCH o.doctor " +
           "WHERE oi.product.id = :productId")
    List<OrderItem> findByProductId(@Param("productId") Long productId);
    
    // Get total quantity ordered for a product
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi " +
           "WHERE oi.product.id = :productId AND oi.order.status != 'CANCELLED'")
    Long getTotalQuantityByProductId(@Param("productId") Long productId);
    
    // Get top selling products
    @Query("SELECT oi.product.id as productId, oi.product.name as productName, " +
           "oi.product.category as category, SUM(oi.quantity) as totalOrdered " +
           "FROM OrderItem oi " +
           "WHERE oi.order.status != 'CANCELLED' " +
           "GROUP BY oi.product.id, oi.product.name, oi.product.category " +
           "ORDER BY totalOrdered DESC")
    List<Object[]> findTopSellingProducts();
}

