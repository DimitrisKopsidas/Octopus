package com.dkopsidas.octopus.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "year")
    private int year;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private PlayerType type;

    @Column(name = "created", updatable = false, nullable = false)
    private Instant created;

    @Column(name = "updated", nullable = false)
    private Instant updated;

    public Player() {
    }

    public Player(UUID id, String name, String password, int year, PlayerType type, Instant created, Instant updated) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.year = year;
        this.type = type;
        this.created = created;
        this.updated = updated;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Min(value = 1987)
    @Max(value = 2027)
    public int getYear() {
        return year;
    }

    public void setYear(@Min(value = 1987) @Max(value = 2027) int year) {
        this.year = year;
    }

    public PlayerType getType() {
        return type;
    }

    public void setType(PlayerType type) {
        this.type = type;
    }

    public Instant getCreated() {
        return created;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public Instant getUpdated() {
        return updated;
    }

    public void setUpdated(Instant updated) {
        this.updated = updated;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Player player = (Player) o;
        return Objects.equals(id, player.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                ", year=" + year +
                ", type=" + type +
                ", created=" + created +
                ", updated=" + updated +
                '}';
    }
}
