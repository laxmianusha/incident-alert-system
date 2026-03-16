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

    public List<Incident> getAllIncidents() {
        return repository.findAll();
    }

    public Incident createIncident(Incident incident) {

        incident.setCreatedAt(LocalDateTime.now().toString());
        incident.setStatus("OPEN");

        Incident savedIncident = repository.save(incident);

        // Publish incident to WebSocket subscribers
        publisher.publish(savedIncident);

        return savedIncident;
    }
}