package com.shyashyashya.refit.domain.scrapfolder.repository;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QnaSetScrapFolderCustomRepository {

    Page<QnaSet> findQnaSetsByScrapFolder(ScrapFolder scrapFolder, Pageable pageable);
}
