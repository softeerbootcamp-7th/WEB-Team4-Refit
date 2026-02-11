package com.shyashyashya.refit.domain.industry.repository;

import com.shyashyashya.refit.domain.industry.model.Industry;
import java.util.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IndustryRepository extends JpaRepository<Industry, Long> {
    Long countAllByIdIn(Collection<Long> ids);
}
