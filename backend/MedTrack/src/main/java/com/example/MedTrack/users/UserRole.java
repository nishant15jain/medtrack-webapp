package com.example.MedTrack.users;

public enum UserRole {
    REP("Can log visits, issue samples"),
    MANAGER("Can view visits, samples, and doctor lists in their team"),
    ADMIN("Can add/edit reps, doctors, products, see all data");
    
    private final String description;
    
    UserRole(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
