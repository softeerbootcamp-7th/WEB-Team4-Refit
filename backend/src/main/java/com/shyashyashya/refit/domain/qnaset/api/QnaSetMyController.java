package com.shyashyashya.refit.domain.qnaset.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryQuestionResponse;
import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetSearchRequest;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.QnaSetSearchResponse;
import com.shyashyashya.refit.domain.qnaset.service.QnaSetMyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Qna-Set My Controller", description = "나의 질문과 관련된 API 컨트롤러 입니다.")
@RestController
@RequestMapping("/qna-set/my")
@RequiredArgsConstructor
public class QnaSetMyController {

    private final QnaSetMyService qnaSetMyService;

    @Operation(
            summary = "나의 빈출 질문 카테고리 리스트와 각 카테고리 별 질문 개수를 조회합니다.",
            description = "나의 빈출 질문 카테고리 리스트와 각 카테고리 별 질문 개수를 질문 개수가 많은 카테고리 순으로 정렬하여 조회합니다.")
    @GetMapping("/frequent/category")
    public ResponseEntity<CommonResponse<Page<FrequentQnaSetCategoryResponse>>> getMyFrequentQnaSetCategories(
            Pageable pageable) {
        var body = qnaSetMyService.getFrequentQnaSetCategories(pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "나의 빈출 질문 중 특정 카테고리에 속한 질문들을 조회합니다.",
            description = "나의 빈출 질문 중 특정 카테고리에 속한 질문들을 조회합니다.")
    @GetMapping("/frequent/category/{categoryId}")
    public ResponseEntity<CommonResponse<Page<FrequentQnaSetCategoryQuestionResponse>>> getMyFrequentQnaSetCategoryQuestions(
            Long categoryId, Pageable pageable) {
        var body = qnaSetMyService.getFrequentQnaSetCategoryQuestions(categoryId, pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "나의 면접 질문들을 검색합니다.", description = "나의 면접 질문들을 검색합니다. 조건을 넣지 않으면 전체 데이터를 조회합니다.")
    @PostMapping("/search")
    public ResponseEntity<CommonResponse<Page<QnaSetSearchResponse>>> searchMyQnaSet(@Valid @RequestBody QnaSetSearchRequest request, Pageable pageable) {
        var body = qnaSetMyService.searchQnaSets(request, pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
