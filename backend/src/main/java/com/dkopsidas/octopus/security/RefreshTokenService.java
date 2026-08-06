package com.dkopsidas.octopus.security;

import com.dkopsidas.octopus.config.AuthProperties;
import com.dkopsidas.octopus.domain.entity.RefreshToken;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.exception.ExpiredRefreshTokenException;
import com.dkopsidas.octopus.exception.InvalidRefreshTokenException;
import com.dkopsidas.octopus.exception.RevokedRefreshTokenException;
import com.dkopsidas.octopus.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final int TOKEN_BYTE_LENGTH = 32;
    private static final String HASH_ALGORITHM = "SHA-256";

    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthProperties authProperties;
    private final Clock clock;
    private final SecureRandom secureRandom;

    @Transactional
    public IssuedRefreshToken issueFor(User user) {
        byte[] randomBytes = new byte[TOKEN_BYTE_LENGTH];
        secureRandom.nextBytes(randomBytes);

        String tokenValue = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
        Instant created = clock.instant();
        Instant expiresAt = created.plus(authProperties.refreshToken().ttl());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hash(tokenValue));
        refreshToken.setCreated(created);
        refreshToken.setExpiresAt(expiresAt);
        refreshTokenRepository.save(refreshToken);

        return new IssuedRefreshToken(tokenValue, expiresAt);
    }

    @Transactional(readOnly = true)
    public RefreshToken requireValid(String tokenValue) {
        if (!isWellFormed(tokenValue)) {
            throw new InvalidRefreshTokenException();
        }

        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(hash(tokenValue))
                .orElseThrow(InvalidRefreshTokenException::new);

        if (refreshToken.isRevoked()) {
            throw new RevokedRefreshTokenException();
        }
        if (refreshToken.isExpiredAt(clock.instant())) {
            throw new ExpiredRefreshTokenException();
        }

        return refreshToken;
    }

    @Transactional
    public void revoke(String tokenValue) {
        if (!isWellFormed(tokenValue)) {
            return;
        }

        refreshTokenRepository.findByTokenHash(hash(tokenValue))
                .filter(refreshToken -> !refreshToken.isRevoked())
                .ifPresent(refreshToken -> {
                    refreshToken.setRevokedAt(clock.instant());
                    refreshTokenRepository.save(refreshToken);
                });
    }

    private boolean isWellFormed(String tokenValue) {
        if (tokenValue == null || tokenValue.isBlank()) {
            return false;
        }

        try {
            byte[] decoded = Base64.getUrlDecoder().decode(tokenValue);
            String canonicalValue = Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(decoded);
            return decoded.length == TOKEN_BYTE_LENGTH
                    && canonicalValue.equals(tokenValue);
        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

    private String hash(String tokenValue) {
        try {
            MessageDigest digest = MessageDigest.getInstance(HASH_ALGORITHM);
            byte[] hash = digest.digest(tokenValue.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
