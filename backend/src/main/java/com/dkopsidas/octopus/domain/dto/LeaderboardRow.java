package com.dkopsidas.octopus.domain.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface LeaderboardRow {
    String getDisplayName();
    BigDecimal getScore();
    LocalDateTime getTimestamp();
}