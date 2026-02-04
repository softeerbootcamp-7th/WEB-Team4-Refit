package com.shyashyashya.refit.domain.scrapfolder.service;

import com.shyashyashya.refit.domain.scrapfolder.dto.ScrapFolderDto;
import com.shyashyashya.refit.domain.scrapfolder.repository.QnaSetScrapFolderRepository;
import com.shyashyashya.refit.domain.scrapfolder.repository.ScrapFolderRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScrapFolderService {

    private final ScrapFolderRepository scrapFolderRepository;
    private final QnaSetScrapFolderRepository qnaSetScrapFolderRepository;
    private final RequestUserContext requestUserContext;

    @Transactional
    public Page<ScrapFolderDto> getMyScrapFolders(Pageable pageable) {
        User user = requestUserContext.getRequestUser();

        return scrapFolderRepository.getScrapFoldersByUser(user, pageable)
            .map(scrapFolder -> {
                Long qnaSetCount = qnaSetScrapFolderRepository.getQnaSetCountByScrapFolder(scrapFolder);
                return ScrapFolderDto.from(scrapFolder, qnaSetCount);
            });
    }
}
