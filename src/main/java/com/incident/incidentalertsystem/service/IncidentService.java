package com.incident.incidentalertsystem.service;

import com.incident.incidentalertsystem.model.Incident;
import com.incident.incidentalertsystem.repository.IncidentRepository;
import com.incident.incidentalertsystem.websocket.IncidentPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository repository;
    private final IncidentPublisher publisher;

    public IncidentService(IncidentRepository repository, IncidentPublisher publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }

    public Incident createIncident(Incident incident) {

        incident.setStatus("OPEN");
        incident.setCreatedAt(LocalDateTime.now().toString());

        Incident saved = repository.save(incident);

        // Publish real-time event
        publisher.publishIncident(saved);

        return saved;
    }

    public List<Incident> getAllIncidents() {
        return repository.findAll();
    }
}