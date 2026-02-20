package com.shyashyashya.refit.domain.qnaset.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetSearchRequest;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryQuestionResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.MyDifficultQuestionResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.QnaSetSearchResponse;
import com.shyashyashya.refit.domain.qnaset.service.QnaSetMyService;
import com.shyashyashya.refit.global.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Qna Set My Controller", description = "나의 질문 아카이브 데이터와 관련된 API 컨트롤러 입니다.")
@RestController
@RequestMapping("/qna-set/my")
@RequiredArgsConstructor
public class QnaSetMyController {

    private final QnaSetMyService qnaSetMyService;

    @Operation(summary = "대시보드에서 '내가 어렵게 느낀 질문'을 조회합니다.")
    @Parameters(
            value = {
                @Parameter(name = "page", description = "페이지 번호 (0..N)"),
                @Parameter(name = "size", description = "페이지 크기 (기본값 20)"),
                @Parameter(
                        name = "sort",
                        description = "정렬 기준 (형식: field,asc / field,desc)<br>지원하는 정렬 필드:<br>- interviewStartAt (면접일)",
                        array = @ArraySchema(schema = @Schema(type = "string")))
            })
    @GetMapping("/difficult")
    public ResponseEntity<ApiResponse<Page<MyDifficultQuestionResponse>>> getMyDifficultQnaSets(
            @Parameter(hidden = true) Pageable pageable) {
        var body = qnaSetMyService.getMyDifficultQnaSets(pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "나의 빈출 질문 카테고리 리스트와 각 카테고리 별 질문 개수를 조회합니다.",
            description = "나의 빈출 질문 카테고리 리스트와 각 카테고리 별 질문 개수를 질문 개수가 많은 카테고리 순으로 정렬하여 조회합니다.")
    @GetMapping("/frequent/category")
    public ResponseEntity<ApiResponse<Page<FrequentQnaSetCategoryResponse>>> getMyFrequentQnaSetCategories(
            @ParameterObject Pageable pageable) {
        var body = qnaSetMyService.getFrequentQnaSetCategories(pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "나의 빈출 질문 중 특정 카테고리에 속한 질문들을 조회합니다.", description = "나의 빈출 질문 중 특정 카테고리에 속한 질문들을 조회합니다.")
    @GetMapping("/frequent/category/{categoryId}")
    public ResponseEntity<ApiResponse<Page<FrequentQnaSetCategoryQuestionResponse>>>
            getMyFrequentQnaSetCategoryQuestions(@PathVariable Long categoryId, @ParameterObject Pageable pageable) {
        var body = qnaSetMyService.getFrequentQnaSetCategoryQuestions(categoryId, pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "나의 면접 질문들을 검색합니다.", description = "나의 면접 질문들을 검색합니다. 조건을 넣지 않으면 전체 데이터를 조회합니다.")
    @Parameters(
            value = {
                @Parameter(name = "page", description = "페이지 번호 (0..N)"),
                @Parameter(name = "size", description = "페이지 크기 (기본값 20)"),
                @Parameter(
                        name = "sort",
                        description =
                                "정렬 기준 (형식: field,asc / field,desc)<br>지원하는 정렬 필드:<br>- interviewStartAt (면접일)<br>- updatedAt (수정일)",
                        array = @ArraySchema(schema = @Schema(type = "string")))
            })
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<QnaSetSearchResponse>>> searchMyQnaSet(
            @Valid @RequestBody QnaSetSearchRequest request, @Parameter(hidden = true) Pageable pageable) {
        var body = qnaSetMyService.searchQnaSets(request, pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
