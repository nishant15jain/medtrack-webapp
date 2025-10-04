package com.example.MedTrack.orders;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrderRequest {
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotNull(message = "Order date is required")
    private LocalDate orderDate;
    
    @NotNull(message = "Status is required")
    private OrderStatus status;
    
    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;
    
    private String notes; // Optional
    
    private Long visitId; // Optional
    
    @NotNull(message = "Order items are required")
    @Valid
    private List<OrderItemRequest> orderItems;
}

