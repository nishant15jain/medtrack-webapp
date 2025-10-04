CREATE TABLE sample (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    date_issued DATE NOT NULL,
    visit_id BIGINT,              -- optional
    FOREIGN KEY (doctor_id) REFERENCES doctor(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (visit_id) REFERENCES visit(id) ON DELETE SET NULL,
    INDEX idx_sample_doctor(doctor_id),
    INDEX idx_sample_product(product_id),
    INDEX idx_sample_visit(visit_id)
);

