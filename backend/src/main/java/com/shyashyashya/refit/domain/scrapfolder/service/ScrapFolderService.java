package com.shyashyashya.refit.domain.scrapfolder.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.SCRAP_FOLDER_NAME_DUPLICATED;
import static com.shyashyashya.refit.global.exception.ErrorCode.SCRAP_FOLDER_NOT_FOUND;

import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderQnaSetResponse;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderResponse;
import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.repository.QnaSetScrapFolderRepository;
import com.shyashyashya.refit.domain.scrapfolder.repository.ScrapFolderRepository;
import com.shyashyashya.refit.domain.scrapfolder.service.validator.ScrapFolderValidator;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
// TODO: 가장 어려웠던 질문 폴더 관련 유효성 검증 추가하기
public class ScrapFolderService {

    private final ScrapFolderRepository scrapFolderRepository;
    private final QnaSetScrapFolderRepository qnaSetScrapFolderRepository;
    private final RequestUserContext requestUserContext;
    private final ScrapFolderValidator scrapFolderValidator;

    @Transactional(readOnly = true)
    public Page<ScrapFolderResponse> getMyScrapFolders(Pageable pageable) {
        User user = requestUserContext.getRequestUser();

        // TODO: 추후 QueryDSL 도입 후 N+1 문제 해결 예정
        return scrapFolderRepository.findAllByUser(user, pageable).map(scrapFolder -> {
            Long qnaSetCount = qnaSetScrapFolderRepository.countByScrapFolder(scrapFolder);
            return ScrapFolderResponse.from(scrapFolder, qnaSetCount);
        });
    }

    @Transactional(readOnly = true)
    public Page<ScrapFolderQnaSetResponse> getQnaSetsInScrapFolder(Long scrapFolderId, Pageable pageable) {
        User user = requestUserContext.getRequestUser();
        ScrapFolder scrapFolder = scrapFolderRepository
                .findById(scrapFolderId)
                .orElseThrow(() -> new CustomException(SCRAP_FOLDER_NOT_FOUND));

        scrapFolderValidator.validateScrapFolderOwner(scrapFolder, user);

        return qnaSetScrapFolderRepository
                .findQnaSetsByScrapFolder(scrapFolder, pageable)
                .map(ScrapFolderQnaSetResponse::from);
    }

    @Transactional
    public void createScrapFolder(String scrapFolderName) {
        User user = requestUserContext.getRequestUser();

        scrapFolderValidator.validateScrapFolderNameNotDuplicated(scrapFolderName, user);

        try {
            scrapFolderRepository.save(ScrapFolder.create(scrapFolderName, user));
        } catch (DataIntegrityViolationException e) {
            throw new CustomException(SCRAP_FOLDER_NAME_DUPLICATED);
        }
    }

    @Transactional
    public void deleteScrapFolder(Long scrapFolderId) {
        User user = requestUserContext.getRequestUser();
        ScrapFolder scrapFolder = scrapFolderRepository
                .findById(scrapFolderId)
                .orElseThrow(() -> new CustomException(SCRAP_FOLDER_NOT_FOUND));

        scrapFolderValidator.validateScrapFolderOwner(scrapFolder, user);

        qnaSetScrapFolderRepository.deleteAllByScrapFolder(scrapFolder);
        scrapFolderRepository.delete(scrapFolder);
    }
}
