package com.shyashyashya.refit.domain.qnaset.dto.response;

import jakarta.validation.constraints.NotNull;

public record QnaSetScrapFolderResponse(
        @NotNull Long scrapFolderId,
        @NotNull String scrapFolderName,
        @NotNull boolean contains) {}
