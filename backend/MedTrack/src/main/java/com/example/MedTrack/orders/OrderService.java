package com.example.MedTrack.orders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.MedTrack.exceptions.ResourceNotFoundException;
import com.example.MedTrack.exceptions.BadRequestException;
import com.example.MedTrack.doctors.Doctor;
import com.example.MedTrack.doctors.DoctorRepository;
import com.example.MedTrack.products.Product;
import com.example.MedTrack.products.ProductRepository;
import com.example.MedTrack.visits.Visit;
import com.example.MedTrack.visits.VisitRepository;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final DoctorRepository doctorRepository;
    private final ProductRepository productRepository;
    private final VisitRepository visitRepository;
    
    public OrderService(OrderRepository orderRepository, 
                       OrderMapper orderMapper,
                       DoctorRepository doctorRepository, 
                       ProductRepository productRepository,
                       VisitRepository visitRepository) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.doctorRepository = doctorRepository;
        this.productRepository = productRepository;
        this.visitRepository = visitRepository;
    }

    @Transactional
    public OrderDto createOrder(OrderRequest request) {
        // Validate doctor exists
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));
        
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
        
        // Validate order date is not in the future
        if (request.getOrderDate().isAfter(LocalDate.now())) {
            throw new BadRequestException("Order date cannot be in the future");
        }
        
        // Validate order items
        if (request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
            throw new BadRequestException("Order must have at least one item");
        }
        
        // Create order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setDoctor(doctor);
        order.setOrderDate(request.getOrderDate());
        order.setStatus(request.getStatus());
        order.setPaymentStatus(request.getPaymentStatus());
        order.setNotes(request.getNotes());
        order.setVisit(visit);
        order.setTotalAmount(BigDecimal.ZERO);
        
        // Create order items
        for (OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(itemRequest.getUnitPrice());
            orderItem.setDiscountPercent(itemRequest.getDiscountPercent() != null ? 
                itemRequest.getDiscountPercent() : BigDecimal.ZERO);
            orderItem.calculateSubtotal();
            
            order.addOrderItem(orderItem);
        }
        
        // Calculate total amount
        order.calculateTotalAmount();
        
        // Save order (cascade will save order items)
        Order savedOrder = orderRepository.save(order);
        
        // Fetch the saved order with associations
        Order orderWithAssociations = orderRepository.findByIdWithAssociations(savedOrder.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found after save"));
        
        return orderMapper.toDto(orderWithAssociations);
    }

    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findByIdWithAssociations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return orderMapper.toDto(order);
    }

    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAllWithAssociations();
        return orders.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByDoctorId(Long doctorId) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        
        List<Order> orders = orderRepository.findByDoctorId(doctorId);
        return orders.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByVisitId(Long visitId) {
        // Validate visit exists
        if (!visitRepository.existsById(visitId)) {
            throw new ResourceNotFoundException("Visit not found with id: " + visitId);
        }
        
        List<Order> orders = orderRepository.findByVisitId(visitId);
        return orders.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        return orders.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByPaymentStatus(PaymentStatus paymentStatus) {
        List<Order> orders = orderRepository.findByPaymentStatus(paymentStatus);
        return orders.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByDateRange(LocalDate startDate, LocalDate endDate) {
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        
        List<Order> orders = orderRepository.findByOrderDateBetween(startDate, endDate);
        return orders.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByDoctorIdAndDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        
        List<Order> orders = orderRepository.findByDoctorIdAndOrderDateBetween(doctorId, startDate, endDate);
        return orders.stream()
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
    }

    public OrderDto getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
        return orderMapper.toDto(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, OrderUpdateRequest request) {
        Order order = orderRepository.findByIdWithAssociations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        if (request.getStatus() != null) {
            order.setStatus(request.getStatus());
        }
        
        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }
        
        if (request.getNotes() != null) {
            order.setNotes(request.getNotes());
        }
        
        Order updatedOrder = orderRepository.save(order);
        Order orderWithAssociations = orderRepository.findByIdWithAssociations(updatedOrder.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found after update"));
        
        return orderMapper.toDto(orderWithAssociations);
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }

    public BigDecimal getTotalRevenue() {
        return orderRepository.getTotalRevenue();
    }

    public BigDecimal getTotalRevenueByDoctorId(Long doctorId) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        return orderRepository.getTotalRevenueByDoctorId(doctorId);
    }

    public BigDecimal getTotalRevenueByDateRange(LocalDate startDate, LocalDate endDate) {
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        return orderRepository.getTotalRevenueByDateRange(startDate, endDate);
    }

    public Long countOrdersByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    public List<OrderDto> getRecentOrders(int limit) {
        List<Order> orders = orderRepository.findRecentOrders();
        return orders.stream()
            .limit(limit)
            .map(orderMapper::toDto)
            .collect(Collectors.toList());
    }

    // Helper method to generate unique order number
    private String generateOrderNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = orderRepository.count() + 1;
        return String.format("ORD-%s-%05d", datePart, count);
    }
}

