package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "crash_logs",
    indexes = {
        @Index(name = "idx_crash_logs_timestamp", columnList = "timestamp"),
        @Index(name = "idx_crash_logs_exception_class", columnList = "exception_class"),
        @Index(name = "idx_crash_logs_resolved", columnList = "resolved")
    }
)
@Getter
@Setter
@NoArgsConstructor
public class CrashLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private Instant timestamp;

    @Column(name = "exception_class", nullable = false, length = 255)
    private String exceptionClass;

    @Column(length = 2000)
    private String message;

    @Column(name = "stack_trace", columnDefinition = "TEXT")
    private String stackTrace;

    @Column(name = "request_uri", length = 500)
    private String requestUri;

    @Column(name = "http_method", length = 10)
    private String httpMethod;

    @Column(name = "actor_id")
    private UUID actorId;

    @Column(name = "actor_username", length = 100)
    private String actorUsername;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "status_code")
    private Integer statusCode;

    @Column(nullable = false)
    private boolean resolved = false;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }
}
