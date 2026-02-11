package com.shyashyashya.refit.domain.industry.repository;

import com.shyashyashya.refit.domain.industry.model.Industry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface IndustryRepository extends JpaRepository<Industry, Long> {
    Long countAllByIdIn(Collection<Long> ids);
}
