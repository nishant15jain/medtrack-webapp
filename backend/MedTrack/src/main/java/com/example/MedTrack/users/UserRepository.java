package com.example.MedTrack.users;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByIsActive(Boolean isActive);
    List<User> findByRoleAndIsActive(UserRole role, Boolean isActive);
}
