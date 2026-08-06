package com.dkopsidas.octopus.security;

import com.dkopsidas.octopus.config.AuthProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.Clock;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RefreshTokenCookieService {

    private final AuthProperties authProperties;
    private final Clock clock;

    public Optional<String> read(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }

        String cookieName = authProperties.refreshToken().cookie().name();
        return Arrays.stream(cookies)
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .filter(StringUtils::hasText)
                .findFirst();
    }

    public void add(HttpServletResponse response, IssuedRefreshToken refreshToken) {
        Duration maxAge = Duration.between(clock.instant(), refreshToken.expiresAt());
        if (maxAge.isNegative()) {
            maxAge = Duration.ZERO;
        }
        response.addHeader(
                HttpHeaders.SET_COOKIE,
                buildCookie(refreshToken.value(), maxAge).toString()
        );
    }

    public void clear(HttpServletResponse response) {
        response.addHeader(
                HttpHeaders.SET_COOKIE,
                buildCookie("", Duration.ZERO).toString()
        );
    }

    private ResponseCookie buildCookie(String value, Duration maxAge) {
        AuthProperties.Cookie properties = authProperties.refreshToken().cookie();
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie
                .from(properties.name(), value)
                .httpOnly(true)
                .secure(properties.secure())
                .sameSite(properties.sameSite())
                .path(properties.path())
                .maxAge(maxAge);

        if (!properties.domain().isBlank()) {
            builder.domain(properties.domain());
        }
        return builder.build();
    }
}
