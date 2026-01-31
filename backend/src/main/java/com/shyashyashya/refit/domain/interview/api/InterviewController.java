package com.shyashyashya.refit.domain.interview.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON201;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON204;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.interview.dto.InterviewFullDto;
import com.shyashyashya.refit.domain.interview.dto.QnaSetDto;
import com.shyashyashya.refit.domain.interview.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.QnaSet;
import com.shyashyashya.refit.domain.interview.model.QnaSetSelfReview;
import com.shyashyashya.refit.domain.interview.model.StarAnalysis;
import com.shyashyashya.refit.domain.interview.service.InterviewService;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/interview")
public class InterviewController {

    private final InterviewService interviewService;

    @DeleteMapping("/{interviewId}")
    public ResponseEntity<CommonResponse<Void>> deleteInterview(@PathVariable Long interviewId) {
        interviewService.deleteInterview(interviewId);
        var response = CommonResponse.success(COMMON204);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CommonResponse<Void>> createInterview(@RequestBody InterviewCreateRequest request) {
        interviewService.createInterview(request);
        var response = CommonResponse.success(COMMON201);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{interviewId}/qna-sets")
    public ResponseEntity<CommonResponse<InterviewFullDto>> getInterviewFull(@PathVariable Long interviewId) {
        Interview interview = interviewService.getInterview(interviewId); // 머지 대기중인 #147 PR에서 구현되어 있음
        List<QnaSet> qnaSets = interviewService.getQnaSets(interviewId);

        List<QnaSetDto> qnaSetDtos = new ArrayList<>(qnaSets.size());
        for (QnaSet qnaSet : qnaSets) {
            QnaSetSelfReview selfReview = interviewService.getSelfReview(qnaSet.getId());
            StarAnalysis starAnalysis = interviewService.getStarAnalysis(qnaSet.getId());
            StarAnalysisDto starAnalysisDto = (starAnalysis == null) ? null : StarAnalysisDto.from(starAnalysis);
            QnaSetDto qnaSetDto = QnaSetDto.from(qnaSet, selfReview, starAnalysisDto);
            qnaSetDtos.add(qnaSetDto);
        }

        InterviewFullDto interviewFullDto = InterviewFullDto.from(interview, qnaSetDtos);
        var response = CommonResponse.success(COMMON200, interviewFullDto);
        return ResponseEntity.ok(response);
    }
}
