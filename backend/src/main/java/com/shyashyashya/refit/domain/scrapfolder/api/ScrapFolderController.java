package com.shyashyashya.refit.domain.scrapfolder.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderQnaSetResponse;
import com.shyashyashya.refit.domain.scrapfolder.dto.response.ScrapFolderResponse;
import com.shyashyashya.refit.domain.scrapfolder.service.ScrapFolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
}
