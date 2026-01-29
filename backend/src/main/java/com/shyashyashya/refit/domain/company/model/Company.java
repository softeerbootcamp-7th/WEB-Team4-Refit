package com.shyashyashya.refit.domain.company.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "companies")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "company_name", columnDefinition = "varchar(20)", unique = true)
    private String name;

    @Column(name = "company_logo_url", columnDefinition = "varchar(2048)")
    private String logoUrl;

    @Column(nullable = false)
    private boolean isSearchAllowed;

    /*
     Factory Method
    */
    public static Company create(String name, String logoUrl, boolean isSearchAllowed) {
        return Company.builder()
                .name(name)
                .logoUrl(logoUrl)
                .isSearchAllowed(isSearchAllowed)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private Company(String name, String logoUrl, boolean isSearchAllowed) {
        this.name = name;
        this.logoUrl = logoUrl;
        this.isSearchAllowed = isSearchAllowed;
    }
}
