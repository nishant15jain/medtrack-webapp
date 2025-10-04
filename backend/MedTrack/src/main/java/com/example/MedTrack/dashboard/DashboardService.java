package com.example.MedTrack.dashboard;

import com.example.MedTrack.users.UserRepository;
import com.example.MedTrack.doctors.DoctorRepository;
import com.example.MedTrack.products.ProductRepository;
import com.example.MedTrack.visits.Visit;
import com.example.MedTrack.visits.VisitRepository;
import com.example.MedTrack.samples.SampleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final ProductRepository productRepository;
    private final VisitRepository visitRepository;
    private final SampleRepository sampleRepository;
    
    public DashboardService(
        UserRepository userRepository,
        DoctorRepository doctorRepository,
        ProductRepository productRepository,
        VisitRepository visitRepository,
        SampleRepository sampleRepository
    ) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.productRepository = productRepository;
        this.visitRepository = visitRepository;
        this.sampleRepository = sampleRepository;
    }
    
    public DashboardStatsDto getAdminDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        
        // Total counts
        stats.setTotalUsers(userRepository.count());
        stats.setTotalDoctors(doctorRepository.count());
        stats.setTotalProducts(productRepository.count());
        
        // Recent visits (last 7 days)
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(7);
        List<Visit> recentVisits = visitRepository.findByVisitDateBetween(sevenDaysAgo, today);
        stats.setRecentVisitsCount((long) recentVisits.size());
        
        // Convert recent visits to DTOs (limit to 10 most recent)
        List<RecentVisitDto> recentVisitDtos = recentVisits.stream()
            .sorted((v1, v2) -> v2.getVisitDate().compareTo(v1.getVisitDate()))
            .limit(10)
            .map(visit -> new RecentVisitDto(
                visit.getId(),
                visit.getDoctor().getName(),
                visit.getUser().getName(),
                visit.getVisitDate(),
                visit.getNotes() != null && !visit.getNotes().isEmpty() 
                    ? visit.getNotes().substring(0, Math.min(50, visit.getNotes().length())) + "..." 
                    : "No notes"
            ))
            .collect(Collectors.toList());
        stats.setRecentVisits(recentVisitDtos);
        
        // Active REPs this month
        LocalDate startOfMonth = today.withDayOfMonth(1);
        Long activeReps = visitRepository.countDistinctUsersByDateRange(startOfMonth, today);
        stats.setActiveRepsCount(activeReps != null ? activeReps : 0L);
        
        // Top products by sample quantity (top 5)
        List<Object[]> topProductsData = sampleRepository.findTopProductsBySampleQuantity();
        List<TopProductDto> topProducts = topProductsData.stream()
            .limit(5)
            .map(row -> new TopProductDto(
                (Long) row[0],      // productId
                (String) row[1],    // productName
                (String) row[2],    // category
                (String) row[3],    // manufacturer
                ((Number) row[4]).longValue()  // totalSamples
            ))
            .collect(Collectors.toList());
        stats.setTopProducts(topProducts);
        
        return stats;
    }
}

