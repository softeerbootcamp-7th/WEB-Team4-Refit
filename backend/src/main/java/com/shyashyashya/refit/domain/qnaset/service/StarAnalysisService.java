package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_CREATION_FAILED_ALREADY_IN_PROGRESS;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_PARSING_FAILED;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shyashyashya.refit.domain.interview.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.repository.StarAnalysisRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.gemini.GeminiGenerateResponse;
import com.shyashyashya.refit.global.gemini.StarAnalysisGeminiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StarAnalysisService {

    private final StarAnalysisRepository starAnalysisRepository;

    private final ObjectMapper objectMapper;

    @Transactional
    public StarAnalysis createInProgressStarAnalysis(QnaSet qnaSet) {
        if (starAnalysisRepository.existsByQnaSet(qnaSet)) {
            throw new CustomException(STAR_ANALYSIS_CREATION_FAILED_ALREADY_IN_PROGRESS);
        }

        return starAnalysisRepository.save(StarAnalysis.createInProgressStarAnalysis(qnaSet));
    }

    @Transactional
    public StarAnalysisDto onRequestSuccess(Long starAnalysisId, GeminiGenerateResponse rsp) {
        // TODO orElse에 적절한 값 또는 에러 날리도록 변경
        String text = rsp.firstText().orElse("");

        log.info("[Gemini Response text]\n" + text);
        log.info("start parse Gemini response");

        StarAnalysisGeminiResponse geminiResponse = parseStarAnalysisGeminiResponse(text);
        StarAnalysis starAnalysis = starAnalysisRepository
                .findById(starAnalysisId)
                .orElseThrow(() -> new CustomException(STAR_ANALYSIS_NOT_FOUND));

        starAnalysis.completeStarAnalysis(
                geminiResponse.getS(),
                geminiResponse.getT(),
                geminiResponse.getA(),
                geminiResponse.getR(),
                geminiResponse.getOverallSummary());

        return StarAnalysisDto.from(starAnalysis);
    }

    @Transactional
    public void onRequestFail(Long starAnalysisId, Throwable e) {
        log.error("스타 분석 생성 요청이 실패하였습니다. {}", e.getCause(), e);
        starAnalysisRepository.deleteById(starAnalysisId);
    }

    private StarAnalysisGeminiResponse parseStarAnalysisGeminiResponse(String text) {
        try {
            return objectMapper.readValue(text, StarAnalysisGeminiResponse.class);
        } catch (JsonProcessingException e) {
            throw new CustomException(STAR_ANALYSIS_PARSING_FAILED);
        }
    }


}
