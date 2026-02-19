package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_CREATION_FAILED_ALREADY_IN_PROGRESS;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_DELETE_NOT_ALLOWED_STATUS;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_NOT_FOUND;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysisGenerationStatus;
import com.shyashyashya.refit.domain.qnaset.repository.StarAnalysisRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.gemini.dto.StarAnalysisGeminiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StarAnalysisService {

    private final StarAnalysisRepository starAnalysisRepository;

    @Transactional
    public StarAnalysis createInProgressStarAnalysis(QnaSet qnaSet) {
        if (starAnalysisRepository.existsByQnaSet(qnaSet)) {
            throw new CustomException(STAR_ANALYSIS_CREATION_FAILED_ALREADY_IN_PROGRESS);
        }

        return starAnalysisRepository.save(StarAnalysis.create(qnaSet));
    }

    @Transactional
    public StarAnalysis updateStarAnalysis(Long starAnalysisId, StarAnalysisGeminiResponse starAnalysisGeminiResponse) {
        StarAnalysis starAnalysis = starAnalysisRepository
                .findById(starAnalysisId)
                .orElseThrow(() -> new CustomException(STAR_ANALYSIS_NOT_FOUND));

        starAnalysis.complete(
                starAnalysisGeminiResponse.s(),
                starAnalysisGeminiResponse.t(),
                starAnalysisGeminiResponse.a(),
                starAnalysisGeminiResponse.r(),
                starAnalysisGeminiResponse.overallSummary());
        return starAnalysis;
    }

    @Transactional
    public void deleteInProgressStarAnalysis(Long starAnalysisId) {
        StarAnalysis starAnalysis = starAnalysisRepository
                .findById(starAnalysisId)
                .orElseThrow(() -> new CustomException(STAR_ANALYSIS_NOT_FOUND));
        if (starAnalysis.getStatus() != StarAnalysisGenerationStatus.IN_PROGRESS) {
            throw new CustomException(STAR_ANALYSIS_DELETE_NOT_ALLOWED_STATUS);
        }
        starAnalysisRepository.deleteById(starAnalysisId);
    }
}
