package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_CATEGORY_NOT_FOUND;

import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetSearchRequest;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryQuestionResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.QnaSetSearchResponse;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QnaSetMyService {

    private final RequestUserContext requestUserContext;
    private final QnaSetRepository qnaSetRepository;
    private final QnaSetCategoryRepository qnaSetCategoryRepository;

    @Transactional(readOnly = true)
    public Page<FrequentQnaSetCategoryResponse> getFrequentQnaSetCategories(Pageable pageable) {
        User requestUser = requestUserContext.getRequestUser();
        // TODO : 사용자의 약관 동의 여부 검증

        return qnaSetRepository.findFrequentQnaSetCategoryByUser(requestUser, pageable);
    }

    @Transactional(readOnly = true)
    public Page<FrequentQnaSetCategoryQuestionResponse> getFrequentQnaSetCategoryQuestions(
            Long categoryId, Pageable pageable) {
        User requestUser = requestUserContext.getRequestUser();

        QnaSetCategory category = qnaSetCategoryRepository
                .findById(categoryId)
                .orElseThrow(() -> new CustomException(QNA_SET_CATEGORY_NOT_FOUND));

        return qnaSetRepository
                .findAllByUserAndQnaSetCategory(requestUser, category, pageable)
                .map(FrequentQnaSetCategoryQuestionResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<QnaSetSearchResponse> searchQnaSets(QnaSetSearchRequest request, Pageable pageable) {
        User requestUser = requestUserContext.getRequestUser();

        return qnaSetRepository
            .searchMyQnaSet(
                    requestUser,
                    request.keyword(),
                    request.searchFilter().hasStarAnalysis(),
                    request.searchFilter().sInclusionLevels(),
                    request.searchFilter().tInclusionLevels(),
                    request.searchFilter().aInclusionLevels(),
                    request.searchFilter().rInclusionLevels(),
                    pageable)
            .map(QnaSetSearchResponse::from);
    }
}
