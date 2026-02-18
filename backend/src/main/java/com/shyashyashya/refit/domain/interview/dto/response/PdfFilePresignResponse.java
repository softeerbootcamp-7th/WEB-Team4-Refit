package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.interview.dto.PresignedUrlDto;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record PdfFilePresignResponse(
        @NotNull PresignedUrlDto presignedUrlDto, @NotNull LocalDateTime fileUploadedAt) {

    public static PdfFilePresignResponse of(PresignedUrlDto presignedUrlDto, LocalDateTime fileUploadedAt) {
        return PdfFilePresignResponse.builder()
                .presignedUrlDto(presignedUrlDto)
                .fileUploadedAt(fileUploadedAt)
                .build();
    }
}
