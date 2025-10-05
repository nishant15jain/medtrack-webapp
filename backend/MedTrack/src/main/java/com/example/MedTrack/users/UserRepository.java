package com.example.MedTrack.users;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByIsActive(Boolean isActive);
    List<User> findByRoleAndIsActive(UserRole role, Boolean isActive);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.locations WHERE u.id = :id")
    Optional<User> findByIdWithLocations(@Param("id") Long id);
}
