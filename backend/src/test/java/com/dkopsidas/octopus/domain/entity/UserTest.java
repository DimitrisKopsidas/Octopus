package com.dkopsidas.octopus.domain.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserTest {

    @Test
    void publicName_returnsDisplayName_whenPreferenceIsDisplayName() {
        User user = new User();
        user.setDisplayName("Alice");
        user.setDiscordName("alice_discord");
        user.setDisplayPreference(DisplayPreference.DISPLAY_NAME);

        assertEquals("Alice", user.publicName());
    }

    @Test
    void publicName_returnsDiscordInParentheses_whenPreferenceIsDiscordNameAndDiscordPresent() {
        User user = new User();
        user.setDisplayName("Bob");
        user.setDiscordName("bob_handle");
        user.setDisplayPreference(DisplayPreference.DISCORD_NAME);

        assertEquals("Bob (@bob_handle)", user.publicName());
    }

    @Test
    void publicName_doesNotDoubleAtSign_whenDiscordAlreadyHasAtSign() {
        User user = new User();
        user.setDisplayName("Charlie");
        user.setDiscordName("@charlie_handle");
        user.setDisplayPreference(DisplayPreference.DISCORD_NAME);

        assertEquals("Charlie (@charlie_handle)", user.publicName());
    }

    @Test
    void publicName_fallsBackToDisplayName_whenDiscordNameBlankEvenIfPreferenceIsDiscord() {
        User user = new User();
        user.setDisplayName("Dana");
        user.setDiscordName("   ");
        user.setDisplayPreference(DisplayPreference.DISCORD_NAME);

        assertEquals("Dana", user.publicName());
    }

    @Test
    void publicName_fallsBackToDisplayName_whenDisplayPreferenceIsNull() {
        User user = new User();
        user.setDisplayName("Eve");
        user.setDiscordName("eve_discord");
        user.setDisplayPreference(null);

        assertEquals("Eve", user.publicName());
    }
}
