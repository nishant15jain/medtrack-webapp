ALTER TABLE visit 
ADD COLUMN location_id BIGINT,
ADD COLUMN check_in_time TIMESTAMP,
ADD COLUMN check_out_time TIMESTAMP,
ADD COLUMN status VARCHAR(20) DEFAULT 'COMPLETED',
ADD FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
ADD INDEX idx_visit_location(location_id),
ADD INDEX idx_visit_status(status);

