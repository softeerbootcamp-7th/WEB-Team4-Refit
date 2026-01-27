package com.shyashyashya.refit.domain.industry.model;

import com.shyashyashya.refit.domain.common.model.BaseEntity;
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
@Table(name = "industries")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Industry extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "industry_id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "industry_name", columnDefinition = "varchar(20)", nullable = false)
    private String name;

    /*
      Factory Method
     */
    public static Industry create(String name) {
        return Industry.builder()
                .name(name)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private Industry(String name) {
        this.name = name;
    }
}
