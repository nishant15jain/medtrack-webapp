package com.example.MedTrack.orders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "API for managing product orders from doctors")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Create a new order", description = "Creates a new product order from a doctor (REP, MANAGER, ADMIN)")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(orderRequest));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieves a specific order by its ID")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<OrderDto> getOrderById(
            @Parameter(description = "ID of the order to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    @Operation(summary = "Get all orders", description = "Retrieves a list of all orders")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get orders by doctor ID", description = "Retrieves all orders from a specific doctor")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getOrdersByDoctorId(
            @Parameter(description = "Doctor ID to filter by") @PathVariable Long doctorId) {
        return ResponseEntity.ok(orderService.getOrdersByDoctorId(doctorId));
    }

    @GetMapping("/visit/{visitId}")
    @Operation(summary = "Get orders by visit ID", description = "Retrieves all orders created during a specific visit")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getOrdersByVisitId(
            @Parameter(description = "Visit ID to filter by") @PathVariable Long visitId) {
        return ResponseEntity.ok(orderService.getOrdersByVisitId(visitId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get orders by status", description = "Retrieves all orders with a specific status")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getOrdersByStatus(
            @Parameter(description = "Order status to filter by") @PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    @GetMapping("/payment-status/{paymentStatus}")
    @Operation(summary = "Get orders by payment status", description = "Retrieves all orders with a specific payment status")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getOrdersByPaymentStatus(
            @Parameter(description = "Payment status to filter by") @PathVariable PaymentStatus paymentStatus) {
        return ResponseEntity.ok(orderService.getOrdersByPaymentStatus(paymentStatus));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get orders by date range", description = "Retrieves all orders within a date range")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getOrdersByDateRange(
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(orderService.getOrdersByDateRange(startDate, endDate));
    }

    @GetMapping("/doctor/{doctorId}/date-range")
    @Operation(summary = "Get orders by doctor and date range", description = "Retrieves orders from a doctor within a date range")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getOrdersByDoctorIdAndDateRange(
            @Parameter(description = "Doctor ID to filter by") @PathVariable Long doctorId,
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(orderService.getOrdersByDoctorIdAndDateRange(doctorId, startDate, endDate));
    }

    @GetMapping("/order-number/{orderNumber}")
    @Operation(summary = "Get order by order number", description = "Retrieves a specific order by its order number")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<OrderDto> getOrderByOrderNumber(
            @Parameter(description = "Order number to search for") @PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByOrderNumber(orderNumber));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update order status", description = "Updates an order's status, payment status, or notes")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @Parameter(description = "ID of the order to update") @PathVariable Long id, 
            @Valid @RequestBody OrderUpdateRequest updateRequest) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, updateRequest));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order", description = "Deletes an order by its ID")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrder(
            @Parameter(description = "ID of the order to delete") @PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reports/total-revenue")
    @Operation(summary = "Get total revenue", description = "Retrieves the total revenue from all non-cancelled orders")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<BigDecimal> getTotalRevenue() {
        return ResponseEntity.ok(orderService.getTotalRevenue());
    }

    @GetMapping("/reports/doctor/{doctorId}/total-revenue")
    @Operation(summary = "Get total revenue by doctor", description = "Retrieves the total revenue from a specific doctor's orders")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<BigDecimal> getTotalRevenueByDoctorId(
            @Parameter(description = "Doctor ID") @PathVariable Long doctorId) {
        return ResponseEntity.ok(orderService.getTotalRevenueByDoctorId(doctorId));
    }

    @GetMapping("/reports/total-revenue/date-range")
    @Operation(summary = "Get total revenue by date range", description = "Retrieves the total revenue within a date range")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<BigDecimal> getTotalRevenueByDateRange(
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(orderService.getTotalRevenueByDateRange(startDate, endDate));
    }

    @GetMapping("/reports/count-by-status/{status}")
    @Operation(summary = "Count orders by status", description = "Returns the count of orders with a specific status")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Long> countOrdersByStatus(
            @Parameter(description = "Order status") @PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.countOrdersByStatus(status));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent orders", description = "Retrieves the most recent orders")
    @PreAuthorize("hasRole('REP') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getRecentOrders(
            @Parameter(description = "Number of orders to retrieve") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(orderService.getRecentOrders(limit));
    }
}

