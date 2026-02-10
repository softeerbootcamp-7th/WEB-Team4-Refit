package com.shyashyashya.refit.domain.qnaset.model;

import com.shyashyashya.refit.global.model.BaseEntity;
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
@Table(name = "qna_set_categories")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QnaSetCategory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_set_category_id")
    private Long id;

    @Column(name = "qna_set_category_name", nullable = false, columnDefinition = "varchar(30)")
    private String categoryName;

    @Column(name = "example_question", nullable = false, columnDefinition = "varchar(200)")
    private String exampleQuestion;

    @Column(nullable = false)
    private double cohesion;

    /*
     * Static Factory Method
     */
    public static QnaSetCategory create(String categoryName, String exampleQuestion, double cohesion) {
        return QnaSetCategory.builder()
                .categoryName(categoryName)
                .exampleQuestion(exampleQuestion)
                .cohesion(cohesion)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private QnaSetCategory(String categoryName, String exampleQuestion, double cohesion) {
        this.categoryName = categoryName;
        this.exampleQuestion = exampleQuestion;
        this.cohesion = cohesion;
    }
}
