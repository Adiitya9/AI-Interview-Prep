package com.interviewprep.security;

import com.interviewprep.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {
    // Added for test flexibility – an optional overridden authorities list
    private Collection<? extends GrantedAuthority> overriddenAuthorities;


    private final User user;

    public CustomUserDetails(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        // Build a minimal User object for the purpose of the test
        this.user = User.builder()
                .id(id)
                .email(email)
                .password(password)
                .fullName("")
                .roles(new java.util.HashSet<>())
                .build();
        this.overriddenAuthorities = authorities;
    }

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (overriddenAuthorities != null) {
            return overriddenAuthorities;
        }
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());
    }

    public Long getId() {
        return user.getId();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isEnabled();
    }
}
