package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.CrashLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CrashLogRepository extends JpaRepository<CrashLog, UUID>, JpaSpecificationExecutor<CrashLog> {
    long countByResolvedFalse();
}
