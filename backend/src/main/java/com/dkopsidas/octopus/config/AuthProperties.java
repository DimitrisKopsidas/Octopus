package com.dkopsidas.octopus.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Validated
@ConfigurationProperties(prefix = "app.auth")
public record AuthProperties(
        @NotNull @Valid Jwt jwt,
        @NotNull @Valid RefreshToken refreshToken
) {
    public record Jwt(
            @NotBlank String issuer,
            @NotBlank String audience,
            @NotNull Duration accessTokenTtl,
            @NotBlank String secret
    ) {
        @AssertTrue(message = "Access-token lifetime must be greater than zero")
        public boolean isAccessTokenTtlPositive() {
            return accessTokenTtl != null
                    && !accessTokenTtl.isZero()
                    && !accessTokenTtl.isNegative();
        }
    }

    public record RefreshToken(
            @NotNull Duration ttl,
            @NotNull @Valid Cookie cookie
    ) {
        @AssertTrue(message = "Refresh-token lifetime must be greater than zero")
        public boolean isTtlPositive() {
            return ttl != null && !ttl.isZero() && !ttl.isNegative();
        }
    }

    public record Cookie(
            @NotBlank String name,
            boolean secure,
            @NotBlank
            @Pattern(
                    regexp = "(?i)Strict|Lax|None",
                    message = "Cookie SameSite must be Strict, Lax, or None"
            )
            String sameSite,
            @NotBlank String path,
            @NotNull String domain
    ) {
        @AssertTrue(message = "SameSite=None requires a Secure cookie")
        public boolean isSameSiteNoneSecure() {
            return !"None".equalsIgnoreCase(sameSite) || secure;
        }
    }
}
