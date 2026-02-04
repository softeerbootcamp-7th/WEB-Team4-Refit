package com.shyashyashya.refit.domain.scrapfolder.repository;

import com.shyashyashya.refit.domain.scrapfolder.model.QnaSetScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QnaSetScrapFolderRepository extends JpaRepository<QnaSetScrapFolder, Long> {

    Long getQnaSetCountByScrapFolder(ScrapFolder scrapFolder);
}
