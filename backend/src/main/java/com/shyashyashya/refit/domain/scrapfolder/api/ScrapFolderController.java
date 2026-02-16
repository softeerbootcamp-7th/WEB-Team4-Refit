package com.shyashyashya.refit.domain.scrapfolder.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON201;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON204;

import com.shyashyashya.refit.domain.scrapfolder.dto.request.ScrapFolderCreateRequest;
import com.shyashyashya.refit.domain.scrapfolder.dto.request.ScrapFolderNameUpdateRequest;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderQnaSetResponse;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderResponse;
import com.shyashyashya.refit.domain.scrapfolder.service.ScrapFolderService;
import com.shyashyashya.refit.global.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Scrap Folder API", description = "스크랩 폴더 관련 API 입니다.")
@RestController
@RequestMapping("/scrap-folder")
@RequiredArgsConstructor
public class ScrapFolderController {

    private final ScrapFolderService scrapFolderService;

    @Operation(
            summary = "나의 스크랩 폴더 리스트를 조회합니다.",
            description = "스크랩 폴더 리스트에 '나의 어려웠던 질문' 폴더는 포함하지 않습니다. 해당 폴더의 내용은 어려웠던 질문을 조회하는 API로 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ScrapFolderResponse>>> getMyScrapFolders(
            @ParameterObject Pageable pageable) {
        var body = scrapFolderService.getMyScrapFolders(pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "나의 스크랩 폴더 내 질문 답변 세트 리스트를 조회합니다.",
            description = "'나의 어려웠던 질문' 폴더는 포함하지 않습니다. 해당 폴더의 내용은 어려웠던 질문을 조회하는 API로 조회합니다.")
    @GetMapping("/{scrapFolderId}")
    public ResponseEntity<ApiResponse<Page<ScrapFolderQnaSetResponse>>> getQnaSetsInScrapFolder(
            @PathVariable Long scrapFolderId, @ParameterObject Pageable pageable) {
        var body = scrapFolderService.getQnaSetsInScrapFolder(scrapFolderId, pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "스크랩 폴더를 생성합니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createScrapFolder(
            @Valid @RequestBody ScrapFolderCreateRequest scrapFolderCreateRequest) {
        scrapFolderService.createScrapFolder(scrapFolderCreateRequest.scrapFolderName());
        var response = ApiResponse.success(COMMON201);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "스크랩 폴더를 삭제합니다.")
    @DeleteMapping("/{scrapFolderId}")
    public ResponseEntity<ApiResponse<Void>> deleteScrapFolder(@PathVariable Long scrapFolderId) {
        scrapFolderService.deleteScrapFolder(scrapFolderId);
        var response = ApiResponse.success(COMMON204);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "스크랩 폴더의 이름을 수정합니다.")
    @PatchMapping("/{scrapFolderId}/name")
    public ResponseEntity<ApiResponse<Void>> updateScrapFolderName(
            @PathVariable Long scrapFolderId,
            @Valid @RequestBody ScrapFolderNameUpdateRequest scrapFolderNameUpdateRequest) {
        scrapFolderService.updateScrapFolderName(scrapFolderId, scrapFolderNameUpdateRequest.scrapFolderName());
        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "주어진 스크랩 폴더에 지정한 질문 답변 세트를 추가합니다.", description = "이미 추가된 상태인 경우 아무 일도 발생하지 않습니다.")
    @PutMapping("{scrapFolderId}/qna-set/{qnaSetId}")
    public ResponseEntity<ApiResponse<Void>> addQnaSetToScrapFolder(
            @PathVariable Long qnaSetId, @PathVariable Long scrapFolderId) {
        scrapFolderService.addQnaSetToScrapFolder(qnaSetId, scrapFolderId);
        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "주어진 스크랩 폴더에서 지정한 질문 답변 세트를 제거합니다.", description = "이미 제거된 상태인 경우 아무 일도 발생하지 않습니다.")
    @DeleteMapping("{scrapFolderId}/qna-set/{qnaSetId}")
    public ResponseEntity<ApiResponse<Void>> removeQnaSetFromScrapFolder(
            @PathVariable Long qnaSetId, @PathVariable Long scrapFolderId) {
        scrapFolderService.removeQnaSetFromScrapFolder(qnaSetId, scrapFolderId);
        var response = ApiResponse.success(COMMON204);
        return ResponseEntity.ok(response);
    }
}
