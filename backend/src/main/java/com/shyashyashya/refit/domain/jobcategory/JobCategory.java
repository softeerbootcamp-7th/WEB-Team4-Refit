package com.shyashyashya.refit.domain.jobcategory;

import com.shyashyashya.refit.domain.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "job_categories")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class JobCategory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_category_id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "job_category_name", columnDefinition = "varchar(50)", nullable = false, unique = true)
    private String name;
}
