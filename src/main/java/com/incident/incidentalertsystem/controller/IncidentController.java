package com.incident.incidentalertsystem.controller;

import com.incident.incidentalertsystem.model.Incident;
import com.incident.incidentalertsystem.service.IncidentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin
public class IncidentController {

    private final IncidentService service;

    public IncidentController(IncidentService service) {
        this.service = service;
    }

    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        return service.createIncident(incident);
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return service.getAllIncidents();
    }
}