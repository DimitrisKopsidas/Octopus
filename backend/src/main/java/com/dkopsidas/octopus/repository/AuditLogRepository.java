package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.domain.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    Page<AuditLog> findByActorId(UUID actorId, Pageable pageable);

    Page<AuditLog> findByAction(AuditAction action, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:actorId IS NULL OR a.actorId = :actorId) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:status IS NULL OR LOWER(a.status) = LOWER(:status)) AND " +
           "(:fromTimestamp IS NULL OR a.timestamp >= :fromTimestamp) AND " +
           "(:toTimestamp IS NULL OR a.timestamp <= :toTimestamp)")
    Page<AuditLog> searchLogs(
            @Param("actorId") UUID actorId,
            @Param("action") AuditAction action,
            @Param("status") String status,
            @Param("fromTimestamp") Instant fromTimestamp,
            @Param("toTimestamp") Instant toTimestamp,
            Pageable pageable
    );
}
