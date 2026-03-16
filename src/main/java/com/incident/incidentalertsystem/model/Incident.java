package com.incident.incidentalertsystem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private String priority;

    // OPEN / IN_PROGRESS / RESOLVED
    private String status = "OPEN";

    private String createdAt;
}