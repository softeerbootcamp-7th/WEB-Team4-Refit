package com.shyashyashya.refit.domain.scrapfolder.dto.request;

import jakarta.validation.constraints.Size;

public record ScrapFolderCreateRequest(@Size(max = 10) String scrapFolderName) {}
