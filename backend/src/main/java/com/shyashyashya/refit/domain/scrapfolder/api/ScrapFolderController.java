package com.shyashyashya.refit.domain.scrapfolder.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON201;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON204;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.scrapfolder.dto.request.ScrapFolderCreateRequest;
import com.shyashyashya.refit.domain.scrapfolder.dto.request.ScrapFolderNameUpdateRequest;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderQnaSetResponse;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderResponse;
import com.shyashyashya.refit.domain.scrapfolder.service.ScrapFolderService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/scrap-folder")
@RequiredArgsConstructor
public class ScrapFolderController {

    private final ScrapFolderService scrapFolderService;

    @Operation(summary = "나의 스크랩 폴더 리스트를 조회합니다.", description = "스크랩 폴더 리스트에 '나의 어려웠던 질문' 폴더는 포함하지 않습니다. 해당 폴더의 내용은 어려웠던 질문을 조회하는 API로 조회합니다.")
    @GetMapping
    public ResponseEntity<CommonResponse<Page<ScrapFolderResponse>>> getMyScrapFolders(Pageable pageable) {
        var body = scrapFolderService.getMyScrapFolders(pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "나의 스크랩 폴더 내 질문 답변 세트 리스트를 조회합니다.", description = "'나의 어려웠던 질문' 폴더는 포함하지 않습니다. 해당 폴더의 내용은 어려웠던 질문을 조회하는 API로 조회합니다.")
    @GetMapping("/{scrapFolderId}")
    public ResponseEntity<CommonResponse<Page<ScrapFolderQnaSetResponse>>> getQnaSetsInScrapFolder(
            @PathVariable Long scrapFolderId, Pageable pageable) {
        var body = scrapFolderService.getQnaSetsInScrapFolder(scrapFolderId, pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "스크랩 폴더를 생성합니다.")
    @PostMapping
    public ResponseEntity<CommonResponse<Void>> createScrapFolder(
            @Valid @RequestBody ScrapFolderCreateRequest scrapFolderCreateRequest) {
        scrapFolderService.createScrapFolder(scrapFolderCreateRequest.scrapFolderName());
        var response = CommonResponse.success(COMMON201);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "스크랩 폴더를 삭제합니다.")
    @DeleteMapping("/{scrapFolderId}")
    public ResponseEntity<CommonResponse<Void>> deleteScrapFolder(@PathVariable Long scrapFolderId) {
        scrapFolderService.deleteScrapFolder(scrapFolderId);
        var response = CommonResponse.success(COMMON204);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "스크랩 폴더의 이름을 수정합니다.")
    @PatchMapping("/{scrapFolderId}/name")
    public ResponseEntity<CommonResponse<Void>> updateScrapFolderName(
            @PathVariable Long scrapFolderId,
            @Valid @RequestBody ScrapFolderNameUpdateRequest scrapFolderNameUpdateRequest) {
        scrapFolderService.updateScrapFolderName(scrapFolderId, scrapFolderNameUpdateRequest.scrapFolderName());
        var response = CommonResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }
}
