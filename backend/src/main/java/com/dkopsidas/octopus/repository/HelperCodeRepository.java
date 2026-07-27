package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.HelperCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface HelperCodeRepository extends JpaRepository<HelperCode, Long> {

    Optional<HelperCode> findByCode(String code);

    boolean existsByCode(String code);

    /**
     * Atomically claims a code, returning the number of rows it changed:
     * 1 if this call won the code, 0 if the code does not exist or was already
     * taken.
     * {@code clearAutomatically} drops any stale copy of the entity from the
     * persistence context, so a later read in the same transaction sees the
     * updated row rather than the pre-update snapshot.
     */
    @Modifying(clearAutomatically = true)
    @Query("""
            UPDATE HelperCode helperCode
               SET helperCode.usedAt = :now
             WHERE helperCode.code = :code
               AND helperCode.usedAt IS NULL
            """)
    int claim(@Param("code") String code, @Param("now") Instant now);
}
