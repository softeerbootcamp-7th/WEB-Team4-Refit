package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_CREATION_ALREADY_IN_PROGRESS;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_PARSING_FAILED;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shyashyashya.refit.domain.interview.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.StarAnalysisRepository;
import com.shyashyashya.refit.global.gemini.GeminiGenerateResponse;
import com.shyashyashya.refit.domain.qnaset.service.temp.StarAnalysisGeminiResponse;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StarAnalysisService {

    private final QnaSetRepository qnaSetRepository;
    private final StarAnalysisRepository starAnalysisRepository;

    private final RequestUserContext requestUserContext;
    private final InterviewValidator interviewValidator;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public QnaSet getValidatedQnaSetForUser(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        return qnaSet;
    }

    @Transactional
    public StarAnalysis createInProgressStarAnalysisTx(Long qnaSetId) {
        // QnaSet qnaSet = getValidatedQnaSetForUser(qnaSetId);
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        // TODO Race Condition 방어용 unique 조건
        if (starAnalysisRepository.existsByQnaSet(qnaSet)) {
            throw new CustomException(STAR_ANALYSIS_CREATION_ALREADY_IN_PROGRESS);
        }

        return starAnalysisRepository.save(StarAnalysis.createInProgressStarAnalysis(qnaSet));
    }

    @Transactional(readOnly = true)
    public QnaSet temp(Long qnaSetId) {
        return qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));
    }

    @Transactional
    public StarAnalysisDto onRequestSuccess(Long starAnalysisId, GeminiGenerateResponse rsp) {
        String text = rsp.firstText().orElse("");

        log.info("[Gemini Response text]\n" + text);
        log.info("start parse Gemini response");

        StarAnalysisGeminiResponse geminiResponse;
        try {
            geminiResponse = objectMapper.readValue(text, StarAnalysisGeminiResponse.class);

            // TODO 임시 transaction template
            StarAnalysis updatedStar = starAnalysisRepository
                    .findById(starAnalysisId)
                    .orElseThrow(() -> new CustomException(STAR_ANALYSIS_NOT_FOUND));

            updatedStar.update(
                    geminiResponse.getS(),
                    geminiResponse.getT(),
                    geminiResponse.getA(),
                    geminiResponse.getR(),
                    geminiResponse.getOverallSummary());

            return StarAnalysisDto.from(updatedStar);
        } catch (JsonProcessingException e) {
            throw new CustomException(STAR_ANALYSIS_PARSING_FAILED);
        }
    }

    @Transactional
    public void onRequestFail(Long starAnalysisId, Throwable err) {}
}
