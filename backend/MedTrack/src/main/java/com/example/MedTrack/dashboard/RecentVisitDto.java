package com.example.MedTrack.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentVisitDto {
    private Long visitId;
    private String doctorName;
    private String repName;
    private LocalDate visitDate;
    private String purpose;
}

