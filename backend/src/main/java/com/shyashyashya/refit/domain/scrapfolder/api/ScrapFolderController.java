package com.shyashyashya.refit.domain.scrapfolder.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON201;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.scrapfolder.dto.request.ScrapFolderCreateRequest;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderQnaSetResponse;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderResponse;
import com.shyashyashya.refit.domain.scrapfolder.service.ScrapFolderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping
    public ResponseEntity<CommonResponse<Page<ScrapFolderResponse>>> getMyScrapFolders(Pageable pageable) {
        var body = scrapFolderService.getMyScrapFolders(pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{scrapFolderId}")
    public ResponseEntity<CommonResponse<Page<ScrapFolderQnaSetResponse>>> getQnaSetsInScrapFolder(
            @PathVariable Long scrapFolderId, Pageable pageable) {
        var body = scrapFolderService.getQnaSetsInScrapFolder(scrapFolderId, pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CommonResponse<Void>> createScrapFolder(
            @RequestBody @Valid ScrapFolderCreateRequest scrapFolderCreateRequest) {
        scrapFolderService.createScrapFolder(scrapFolderCreateRequest.scrapFolderName());
        var response = CommonResponse.success(COMMON201);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{scrapFolderId}")
    public ResponseEntity<CommonResponse<Void>> deleteScrapFolder(@PathVariable Long scrapFolderId) {
        scrapFolderService.deleteScrapFolder(scrapFolderId);
        var response = CommonResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }
}
