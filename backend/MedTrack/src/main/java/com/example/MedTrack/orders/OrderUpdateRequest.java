package com.example.MedTrack.orders;

import lombok.Data;

@Data
public class OrderUpdateRequest {
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String notes;
}

