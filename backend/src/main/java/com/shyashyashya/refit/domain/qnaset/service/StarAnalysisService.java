package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;

import com.shyashyashya.refit.domain.interview.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.StarAnalysisRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StarAnalysisService {

    private final QnaSetRepository qnaSetRepository;
    private final StarAnalysisRepository starAnalysisRepository;

    private final RequestUserContext requestUserContext;
    private final InterviewValidator interviewValidator;

    @Transactional
    public StarAnalysisDto createStarAnalysis(Long qnaSetId) {
        QnaSet qnaSet = getValidatedQnaSetForUser(qnaSetId);

        StarAnalysis starAnalysis = starAnalysisRepository.findByQnaSet(qnaSet).orElseGet(() -> {
            StarAnalysis created = requestGeminiStarAnalysis(qnaSet);
            return starAnalysisRepository.save(created);
        });

        return StarAnalysisDto.from(starAnalysis);
    }

    private QnaSet getValidatedQnaSetForUser(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        return qnaSet;
    }

    private StarAnalysis requestGeminiStarAnalysis(QnaSet qnaSet) {
        // TODO Gemini 요청 보내기

        return StarAnalysis.create(
                StarInclusionLevel.ABSENT,
                StarInclusionLevel.INSUFFICIENT,
                StarInclusionLevel.PRESENT,
                StarInclusionLevel.INSUFFICIENT,
                "전체 요약 텍스트 임시 가짜 데이터",
                qnaSet);
    }
}
