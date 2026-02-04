package com.shyashyashya.refit.domain.scrapfolder.dto;

import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record ScrapFolderDto(
    Long scrapFolderId,
    String scrapFolderName,
    Long qnaSetCount
    ) {

    public static ScrapFolderDto from(ScrapFolder scrapFolder, Long qnaSetCount) {
        return ScrapFolderDto.builder()
            .scrapFolderId(scrapFolder.getId())
            .scrapFolderName(scrapFolder.getName())
            .qnaSetCount(qnaSetCount)
            .build();
    }
}
