package com.shyashyashya.refit.domain.scrapfolder.repository;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.scrapfolder.model.QnaSetScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QnaSetScrapFolderRepository extends JpaRepository<QnaSetScrapFolder, Long> {

    Long countByScrapFolder(ScrapFolder scrapFolder);

    @Query("""
    SELECT qssf.qnaSet
       FROM QnaSetScrapFolder qssf
        WHERE qssf.scrapFolder = :scrapFolder
    """)
    Page<QnaSet> getQnaSetsByScrapFolder(ScrapFolder scrapFolder, Pageable pageable);
}
