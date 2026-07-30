package com.dkopsidas.octopus.security;

import com.dkopsidas.octopus.config.AuthProperties;
import com.dkopsidas.octopus.domain.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccessTokenService {

    private static final String TOKEN_TYPE = "access";

    private final JwtEncoder jwtEncoder;
    private final AuthProperties authProperties;
    private final Clock clock;

    public IssuedAccessToken issueFor(User user) {
        Instant issuedAt = clock.instant();
        Instant expiresAt = issuedAt.plus(authProperties.jwt().accessTokenTtl());
        List<String> authorities = List.of("ROLE_" + user.getRole().name());

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(authProperties.jwt().issuer())
                .subject(user.getId().toString())
                .audience(List.of(authProperties.jwt().audience()))
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .id(UUID.randomUUID().toString())
                .claim("token_type", TOKEN_TYPE)
                .claim("authorities", authorities)
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256)
                .type("JWT")
                .build();

        String tokenValue = jwtEncoder.encode(
                JwtEncoderParameters.from(header, claims)
        ).getTokenValue();
        long expiresIn = Duration.between(issuedAt, expiresAt).toSeconds();

        return new IssuedAccessToken(tokenValue, expiresAt, expiresIn);
    }
}
