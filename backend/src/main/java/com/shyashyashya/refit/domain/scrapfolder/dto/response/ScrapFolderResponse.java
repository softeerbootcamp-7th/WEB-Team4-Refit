package com.shyashyashya.refit.domain.scrapfolder.dto.response;

import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record ScrapFolderResponse(
        @NotNull Long scrapFolderId,
        @NotNull String scrapFolderName,
        @NotNull Long qnaSetCount) {

    public static ScrapFolderResponse from(ScrapFolder scrapFolder, Long qnaSetCount) {
        return ScrapFolderResponse.builder()
                .scrapFolderId(scrapFolder.getId())
                .scrapFolderName(scrapFolder.getName())
                .qnaSetCount(qnaSetCount)
                .build();
    }
}
