package com.example.MedTrack.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private Long totalUsers;
    private Long totalDoctors;
    private Long totalProducts;
    private Long recentVisitsCount;
    private Long activeRepsCount;
    private List<TopProductDto> topProducts;
    private List<RecentVisitDto> recentVisits;
}

