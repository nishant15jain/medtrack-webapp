CREATE TABLE user_locations (
    user_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, location_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    INDEX idx_user_locations_user(user_id),
    INDEX idx_user_locations_location(location_id)
);

