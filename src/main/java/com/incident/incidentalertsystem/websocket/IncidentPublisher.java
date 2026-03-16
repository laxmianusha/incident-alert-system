package com.incident.incidentalertsystem.websocket;

import com.incident.incidentalertsystem.model.Incident;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class IncidentPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public IncidentPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publish(Incident incident) {

        messagingTemplate.convertAndSend(
                "/topic/incidents",
                incident
        );

    }
}