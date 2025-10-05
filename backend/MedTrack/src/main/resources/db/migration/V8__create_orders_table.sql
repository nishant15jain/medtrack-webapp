CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    doctor_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(20) NOT NULL,
    notes TEXT,
    visit_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctor(id) ON DELETE CASCADE,
    FOREIGN KEY (visit_id) REFERENCES visit(id) ON DELETE SET NULL,
    INDEX idx_orders_doctor(doctor_id),
    INDEX idx_orders_visit(visit_id),
    INDEX idx_orders_date(order_date),
    INDEX idx_orders_status(status),
    INDEX idx_orders_number(order_number)
);

