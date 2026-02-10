package com.shyashyashya.refit.domain.qnaset.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.qnaset.dto.PdfHighlightingDto;
import com.shyashyashya.refit.domain.qnaset.dto.request.PdfHighlightingUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.QnaSetScrapFolderResponse;
import com.shyashyashya.refit.domain.qnaset.service.QnaSetService;
import com.shyashyashya.refit.global.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "QnA Set API", description = "질문 답변 세트 관련 API 입니다.")
@RestController
@RequestMapping("/qna-set")
@RequiredArgsConstructor
public class QnaSetController {

    private final QnaSetService qnaSetService;

    @Operation(
            summary = "지정한 산업군 / 직무의 빈출 질문 답변 세트를 조회합니다.",
            description = "지정한 산업군 / 직무의 빈출 질문 답변 세트를 조회합니다. 지정하지 않은 필드에 대해서는 전체를 대상으로 조회합니다.")
    @GetMapping("/frequent")
    public ResponseEntity<ApiResponse<Page<FrequentQnaSetResponse>>> getFrequentQuestions(
            @RequestParam(required = false) List<Long> industryIds,
            @RequestParam(required = false) List<Long> jobCategoryIds,
            Pageable pageable) {
        var body = qnaSetService.getFrequentQuestions(industryIds, jobCategoryIds, pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "지정한 질문에 대해 어려웠던 질문 마킹을 등록합니다.")
    @PatchMapping("/{qnaSetId}/difficult/mark")
    public ResponseEntity<ApiResponse<Void>> markDifficultQuestion(@PathVariable Long qnaSetId) {
        qnaSetService.markDifficultQuestion(qnaSetId);
        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "지정한 질문에 대해 어려웠던 질문 마킹을 등록 해제 합니다.")
    @PatchMapping("/{qnaSetId}/difficult/unmark")
    public ResponseEntity<ApiResponse<Void>> unmarkDifficultQuestion(@PathVariable Long qnaSetId) {
        qnaSetService.unmarkDifficultQuestion(qnaSetId);
        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "지정한 질문 답변 세트의 질문 답변 내용을 수정합니다.", description = "질문 답변 내용 수정은 '기록중' 상태에서만 가능합니다.")
    @PutMapping("/{qnaSetId}")
    public ResponseEntity<ApiResponse<Void>> updateQnaSet(
            @PathVariable Long qnaSetId, @Valid @RequestBody QnaSetUpdateRequest request) {
        // TODO : 질문 답변 내용 수정이 '기록중' 상태에서만 가능하도록 검증 추가
        qnaSetService.updateQnaSet(qnaSetId, request);
        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "지정한 질문 답변 세트에 대해 PDF 하이라이팅 정보를 등록/수정합니다.")
    @PutMapping("/{qnaSetId}/pdf-highlightings")
    public ResponseEntity<ApiResponse<Void>> updatePdfHighlighting(
            @PathVariable Long qnaSetId, @Valid @RequestBody List<PdfHighlightingUpdateRequest> request) {
        qnaSetService.updatePdfHighlighting(qnaSetId, request);
        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "지정한 질문 답변 세트에 대해 등록된 PDF 하이라이팅 정보를 조회합니다.")
    @GetMapping("/{qnaSetId}/pdf-highlightings")
    public ResponseEntity<ApiResponse<List<PdfHighlightingDto>>> getPdfHighlightings(@PathVariable Long qnaSetId) {
        var body = qnaSetService.getPdfHighlightings(qnaSetId);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "지정한 질문 답변 세트가 스크랩 폴더에 포함되어 있는 지 여부가 포함된 스크랩 폴더 리스트를 조회합니다.")
    @GetMapping("/{qnaSetId}/scrap-folder")
    public ResponseEntity<ApiResponse<Page<QnaSetScrapFolderResponse>>> getScrapFoldersContainingQnaSet(
            @PathVariable Long qnaSetId, Pageable pageable) {
        var body = qnaSetService.getScrapFoldersContainingQnaSet(qnaSetId, pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
