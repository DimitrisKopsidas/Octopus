package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@ToString(exclude = "passwordHash")
@Entity
@Table(
        name = "users",
        uniqueConstraints = @UniqueConstraint(name = "uk_users_username", columnNames = "username")
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "year")
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @Getter
    @Column(name = "active", nullable = false)
    private boolean active;

    @Column(name = "discord_name")
    private String discordName;

    @Enumerated(EnumType.STRING)
    @Column(name = "display_preference")
    private DisplayPreference displayPreference = DisplayPreference.DISPLAY_NAME;

    @Column(name = "created", updatable = false, nullable = false)
    private Instant created;

    @Column(name = "updated", nullable = false)
    private Instant updated;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        created = now;
        updated = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updated = Instant.now();
    }

    /**
     * The name every public surface should print -- profile, user menu, question
     * attribution, leaderboard. Falls back to the display name when Discord is the
     * pick but no handle was ever filled in, so a row can never come out blank.
     * Deliberately not a getter: Jackson must not pick it up as a bean property.
     */
    public String publicName() {
        boolean wantsDiscord =
                DisplayPreference.orDefault(displayPreference) == DisplayPreference.DISCORD_NAME;

        return wantsDiscord && discordName != null && !discordName.isBlank()
                ? discordName
                : displayName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

}
