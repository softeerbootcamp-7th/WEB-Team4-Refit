package com.shyashyashya.refit.domain.scrapfolder.repository;

import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import com.shyashyashya.refit.domain.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScrapFolderRepository extends JpaRepository<ScrapFolder, Long> {

    Page<ScrapFolder> findAllByUser(User user, Pageable pageable);
}
