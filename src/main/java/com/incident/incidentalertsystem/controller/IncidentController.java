package com.incident.incidentalertsystem.controller;

import com.incident.incidentalertsystem.model.Incident;
import com.incident.incidentalertsystem.repository.IncidentRepository;
import com.incident.incidentalertsystem.service.IncidentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin
public class IncidentController {

    private final IncidentService service;
    private final IncidentRepository repository;

    public IncidentController(IncidentService service, IncidentRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping
    public List<Incident> getIncidents() {
        return service.getAllIncidents();
    }

    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        return service.createIncident(incident);
    }

    @PutMapping("/{id}/resolve")
    public Incident resolveIncident(@PathVariable Long id) {

        Incident incident = repository.findById(id).orElseThrow();

        incident.setStatus("RESOLVED");

        return repository.save(incident);
    }
}