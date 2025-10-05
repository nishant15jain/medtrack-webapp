package com.example.MedTrack.users;

import com.example.MedTrack.locations.LocationDto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String password; // Optional: only used for password updates
    private UserRole role;
    private String phone;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Long> locationIds;
    private List<LocationDto> locations;
}
