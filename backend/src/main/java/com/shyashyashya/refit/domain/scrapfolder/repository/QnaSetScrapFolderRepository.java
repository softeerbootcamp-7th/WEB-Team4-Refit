package com.shyashyashya.refit.domain.scrapfolder.repository;

import com.shyashyashya.refit.domain.qnaset.dto.response.QnaSetScrapFolderResponse;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.scrapfolder.model.QnaSetScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import com.shyashyashya.refit.domain.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QnaSetScrapFolderRepository extends JpaRepository<QnaSetScrapFolder, Long> {

    Long countByScrapFolder(ScrapFolder scrapFolder);

    @Query("""
    SELECT qssf.qnaSet
    FROM QnaSetScrapFolder qssf
    WHERE qssf.scrapFolder = :scrapFolder
    """)
    Page<QnaSet> findQnaSetsByScrapFolder(ScrapFolder scrapFolder, Pageable pageable);

    @Query("""
    SELECT new com.shyashyashya.refit.domain.qnaset.dto.response.QnaSetScrapFolderResponse(
        sf.id,
        sf.name,
        CASE
            WHEN qssf.id IS NOT NULL THEN true
            ELSE false
        END
    )
    FROM ScrapFolder sf
    LEFT JOIN QnaSetScrapFolder qssf
        ON qssf.scrapFolder = sf
       AND qssf.qnaSet = :qnaSet
    WHERE sf.user = :user
""")
    Page<QnaSetScrapFolderResponse> findAllScrapFoldersWithContainsQnaSet(
            User user, @Param("qnaSet") QnaSet qnaSet, Pageable pageable);

    void deleteAllByScrapFolder(ScrapFolder scrapFolder);
}
