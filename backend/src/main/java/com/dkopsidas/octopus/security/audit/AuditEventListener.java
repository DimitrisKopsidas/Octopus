package com.dkopsidas.octopus.security.audit;

import com.dkopsidas.octopus.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditEventListener {

    private final AuditLogService auditLogService;

    @EventListener
    public void handleAuditEvent(AuditEvent event) {
        auditLogService.logEvent(event);
    }
}
