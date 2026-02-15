package com.shyashyashya.refit.domain.company.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(
        name = "companies",
        indexes = {@Index(name = "idx_company_search_composite", columnList = "is_search_allowed, search_name")})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "company_name", columnDefinition = "varchar(20)", unique = true)
    private String name;

    @Column(name = "search_name", columnDefinition = "varchar(80)")
    private String searchName;

    @Column(name = "company_logo_url", columnDefinition = "varchar(2048)")
    private String logoUrl;

    @Column(name = "is_search_allowed", nullable = false)
    private boolean isSearchAllowed;

    public void allowSearch() {
        this.isSearchAllowed = true;
    }

    /*
     Factory Method
    */
    public static Company create(String name, String searchName, String logoUrl) {
        return Company.builder()
                .name(name)
                .searchName(searchName)
                .logoUrl(logoUrl)
                .isSearchAllowed(false)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private Company(String name, String searchName, String logoUrl, boolean isSearchAllowed) {
        this.name = name;
        this.searchName = searchName;
        this.logoUrl = logoUrl;
        this.isSearchAllowed = isSearchAllowed;
    }
}
