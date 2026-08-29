package com.dkopsidas.octopus.domain.dto;

import java.util.List;

/**
 * What the import did. `skipped` holds the titles that already existed in the
 * course, so the caller can see why the imported count is lower than the file.
 */
public record ImportQuestionsResponseDto(
        int imported,
        int skippedAsDuplicate,
        List<String> skipped
) {}
