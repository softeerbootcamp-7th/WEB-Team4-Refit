package com.shyashyashya.refit.domain.company.repository;

import com.shyashyashya.refit.domain.company.api.response.CompanyResponse;
import com.shyashyashya.refit.domain.company.model.Company;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);

    // TODO: QueryDSL 적용
    @Query(value = """
        SELECT new com.shyashyashya.refit.domain.company.api.response.CompanyResponse(c.id, c.name)
          FROM Company c
         WHERE LOWER(c.decomposedName) LIKE LOWER(CONCAT(:query, '%'))
           AND c.isSearchAllowed = TRUE
    """, countQuery = """
        SELECT COUNT(c)
          FROM Company c
         WHERE LOWER(c.decomposedName) LIKE LOWER(CONCAT(:query, '%'))
           AND c.isSearchAllowed = TRUE
    """)
    Page<CompanyResponse> findAllBySearchQuery(String query, Pageable pageable);
}
