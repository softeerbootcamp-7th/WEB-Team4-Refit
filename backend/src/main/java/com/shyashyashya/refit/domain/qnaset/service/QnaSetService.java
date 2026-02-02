package com.shyashyashya.refit.domain.qnaset.service;

import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetResponse;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QnaSetService {

    private final QnaSetRepository qnaSetRepository;

    @Transactional(readOnly = true)
    public List<FrequentQnaSetResponse> getFrequentQuestions(Long industryId, Long jobCategoryId) {
        return qnaSetRepository.findAllByIndustryAndJobCategory(industryId, jobCategoryId).stream()
                .map(FrequentQnaSetResponse::from)
                .toList();
    }
}
