package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_CATEGORY_NOT_FOUND;

import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetSearchRequest;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryQuestionResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.QnaSetSearchResponse;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
        User requestUser = requestUserContext.getUser();

        // TODO : 로직 고도화 (쿼리로 한번에 조회할 수 있도록)
        List<QnaSet> qna = qnaSetRepository.findAllByUser(requestUser);
        Map<QnaSetCategory, Long> qnaSetCategoryCounts =
                qna.stream().collect(Collectors.groupingBy(QnaSet::getQnaSetCategory, Collectors.counting()));

        List<FrequentQnaSetCategoryResponse> pageContent = getPageContent(pageable, qnaSetCategoryCounts);

        return new PageImpl<>(pageContent, pageable, qnaSetCategoryCounts.size());
    }

    @Transactional(readOnly = true)
    public Page<FrequentQnaSetCategoryQuestionResponse> getFrequentQnaSetCategoryQuestions(
            Long categoryId, Pageable pageable) {
        User requestUser = requestUserContext.getUser();

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
                .searchQnaSet(
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

    private List<FrequentQnaSetCategoryResponse> getPageContent(
            Pageable pageable, Map<QnaSetCategory, Long> qnaSetCategoryCounts) {
        var sortedList = qnaSetCategoryCounts.entrySet().stream()
                .sorted(Map.Entry.<QnaSetCategory, Long>comparingByValue(Comparator.reverseOrder())
                        .thenComparing(entry -> entry.getKey().getCategoryName()))
                .map((entry) -> FrequentQnaSetCategoryResponse.of(entry.getKey(), entry.getValue()))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), sortedList.size());

        return sortedList.subList(start, end);
    }
}
