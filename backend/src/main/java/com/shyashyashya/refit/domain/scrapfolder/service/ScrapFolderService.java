package com.shyashyashya.refit.domain.scrapfolder.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.SCRAP_FOLDER_NOT_FOUND;

import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderQnaSetResponse;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderResponse;
import com.shyashyashya.refit.domain.scrapfolder.model.QnaSetScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.repository.QnaSetScrapFolderRepository;
import com.shyashyashya.refit.domain.scrapfolder.repository.ScrapFolderRepository;
import com.shyashyashya.refit.domain.scrapfolder.service.validator.ScrapFolderValidator;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
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
    private final QnaSetRepository qnaSetRepository;
    private final RequestUserContext requestUserContext;
    private final ScrapFolderValidator scrapFolderValidator;
    private final InterviewValidator interviewValidator;

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
        scrapFolderRepository.save(ScrapFolder.create(scrapFolderName, user));
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

    @Transactional
    public void updateScrapFolderName(Long scrapFolderId, String scrapFolderName) {
        User user = requestUserContext.getRequestUser();
        ScrapFolder scrapFolder = scrapFolderRepository
                .findById(scrapFolderId)
                .orElseThrow(() -> new CustomException(SCRAP_FOLDER_NOT_FOUND));

        scrapFolderValidator.validateScrapFolderOwner(scrapFolder, user);
        scrapFolder.updateName(scrapFolderName);
    }

    @Transactional
    public void addQnaSetToScrapFolder(Long qnaSetId, Long scrapFolderId) {
        ScrapFolder scrapFolder = scrapFolderRepository
                .findById(scrapFolderId)
                .orElseThrow(() -> new CustomException(SCRAP_FOLDER_NOT_FOUND));
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);
        scrapFolderValidator.validateScrapFolderOwner(
                scrapFolder, qnaSet.getInterview().getUser());

        if (!qnaSetScrapFolderRepository.existsByQnaSetAndScrapFolder(qnaSet, scrapFolder)) {
            qnaSetScrapFolderRepository.save(QnaSetScrapFolder.create(qnaSet, scrapFolder));
        }
    }

    @Transactional
    public void removeQnaSetFromScrapFolder(Long qnaSetId, Long scrapFolderId) {
        ScrapFolder scrapFolder = scrapFolderRepository
                .findById(scrapFolderId)
                .orElseThrow(() -> new CustomException(SCRAP_FOLDER_NOT_FOUND));
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);
        scrapFolderValidator.validateScrapFolderOwner(
                scrapFolder, qnaSet.getInterview().getUser());

        qnaSetScrapFolderRepository.deleteByQnaSetAndScrapFolder(qnaSet, scrapFolder);
    }

    // TODO: ID->Entity 변환기 별도로 분리 고려
    private QnaSet getValidatedQnaSet(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));
        User requestUser = requestUserContext.getRequestUser();
        interviewValidator.validateInterviewOwner(qnaSet.getInterview(), requestUser);
        return qnaSet;
    }
}
