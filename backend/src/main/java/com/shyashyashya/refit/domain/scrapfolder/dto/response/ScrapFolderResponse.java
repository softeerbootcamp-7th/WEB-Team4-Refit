package com.shyashyashya.refit.domain.scrapfolder.dto.response;

import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record ScrapFolderResponse(Long scrapFolderId, String scrapFolderName, Long qnaSetCount) {

    public static ScrapFolderResponse from(ScrapFolder scrapFolder, Long qnaSetCount) {
        return ScrapFolderResponse.builder()
                .scrapFolderId(scrapFolder.getId())
                .scrapFolderName(scrapFolder.getName())
                .qnaSetCount(qnaSetCount)
                .build();
    }
}
