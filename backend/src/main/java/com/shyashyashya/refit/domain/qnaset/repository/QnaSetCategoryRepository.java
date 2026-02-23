package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface QnaSetCategoryRepository extends JpaRepository<QnaSetCategory, Long> {

    @Query("""
        DELETE
          FROM QnaSetCategory c
         WHERE NOT EXISTS (
            SELECT 1
              FROM QnaSet q
             WHERE q.qnaSetCategory = c
        )
    """)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    int deleteEmptyCategory();

    @Query("""
        SELECT c.id
          FROM QnaSetCategory c
         WHERE EXISTS (
            SELECT 1
              FROM QnaSet q
             WHERE q.qnaSetCategory = c
        )
    """)
    List<Long> findAllNotEmptyCategoryIds();
}
