package com.example.MedTrack.orders;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private String orderNumber;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialty;
    private String doctorHospital;
    private LocalDate orderDate;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private String notes;
    private Long visitId;
    private LocalDate visitDate; // If linked to a visit
    private List<OrderItemDto> orderItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

