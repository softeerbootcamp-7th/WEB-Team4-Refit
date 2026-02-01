package com.shyashyashya.refit.domain.company.repository;

import com.shyashyashya.refit.domain.company.model.Company;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);
}
