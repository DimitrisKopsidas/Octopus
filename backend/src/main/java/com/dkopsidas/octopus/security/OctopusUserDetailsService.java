package com.dkopsidas.octopus.security;

import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OctopusUserDetailsService implements UserDetailsService {

    private static final String INVALID_CREDENTIALS_MESSAGE = "Invalid username or password";

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username == null || username.isBlank()) {
            throw new UsernameNotFoundException(INVALID_CREDENTIALS_MESSAGE);
        }

        User user = userRepository.findByUsernameIgnoreCase(username.trim())
                .orElseThrow(() -> new UsernameNotFoundException(INVALID_CREDENTIALS_MESSAGE));

        return AuthenticatedUser.from(user);
    }
}
