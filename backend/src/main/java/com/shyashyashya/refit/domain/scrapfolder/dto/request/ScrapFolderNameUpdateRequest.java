package com.shyashyashya.refit.domain.scrapfolder.dto.request;

import com.shyashyashya.refit.domain.scrapfolder.constant.ScrapFolderConstant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ScrapFolderNameUpdateRequest(
        @NotBlank @Size(max = ScrapFolderConstant.SCRAP_FOLDER_NAME_MAX_LENGTH) String scrapFolderName) {}
