package com.shyashyashya.refit.domain.qnaset.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetResponse;
import com.shyashyashya.refit.domain.qnaset.service.QnaSetService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/qna-set")
@RequiredArgsConstructor
public class QnaSetController {

    private final QnaSetService qnaSetService;

    @GetMapping("/frequent")
    public ResponseEntity<CommonResponse<List<FrequentQnaSetResponse>>> getFrequentQuestions(
            @RequestParam Long industryId, @RequestParam Long jobCategoryId) {
        var body = qnaSetService.getFrequentQuestions(industryId, jobCategoryId);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{qnaSetId}/difficult/mark")
    public ResponseEntity<CommonResponse<Void>> markDifficultQuestion(@PathVariable Long qnaSetId) {
        qnaSetService.markDifficultQuestion(qnaSetId);
        var response = CommonResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{qnaSetId}/difficult/unmark")
    public ResponseEntity<CommonResponse<Void>> unmarkDifficultQuestion(@PathVariable Long qnaSetId) {
        qnaSetService.unmarkDifficultQuestion(qnaSetId);
        var response = CommonResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{qnaSetId}")
    public ResponseEntity<CommonResponse<Void>> updateQnaSet(
            @PathVariable Long qnaSetId, @Valid @RequestBody QnaSetUpdateRequest request) {
        qnaSetService.updateQnaSet(qnaSetId, request);
        var response = CommonResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }
}
