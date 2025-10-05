package com.example.MedTrack.visits;

public enum VisitStatus {
    IN_PROGRESS("Visit is currently in progress"),
    COMPLETED("Visit has been completed"),
    CANCELLED("Visit was cancelled");
    
    private final String description;
    
    VisitStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}

