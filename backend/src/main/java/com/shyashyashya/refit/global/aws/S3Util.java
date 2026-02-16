package com.shyashyashya.refit.global.aws;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_PDF_DELETE_FAILED;

import com.shyashyashya.refit.domain.interview.dto.response.PresignedUrlResponse;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.property.S3Property;
import java.time.Duration;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Component
@RequiredArgsConstructor
@Slf4j
public class S3Util {

    private static final String PDF_EXTENSION = ".pdf";

    private final S3Presigner s3Presigner;
    private final S3Client s3Client;
    private final S3Property s3Property;

    public PresignedUrlResponse createPdfUploadUrl() {
        String key = s3Property.prefix() + UUID.randomUUID() + PDF_EXTENSION;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(s3Property.bucket())
                .key(key)
                .contentType("application/pdf")
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(s3Property.presignExpireSeconds()))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presignRequest);

        return new PresignedUrlResponse(presigned.url().toString(), key, s3Property.presignExpireSeconds());
    }

    public PresignedUrlResponse createPdfDownloadUrl(String key) {

        GetObjectRequest getObjectRequest =
                GetObjectRequest.builder().bucket(s3Property.bucket()).key(key).build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(s3Property.presignExpireSeconds()))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(presignRequest);

        return new PresignedUrlResponse(presigned.url().toString(), key, s3Property.presignExpireSeconds());
    }

    public void deleteFile(String key) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(s3Property.bucket())
                    .key(key)
                    .build());
        } catch (S3Exception e) {
            log.error(e.getMessage(), e);
            throw new CustomException(INTERVIEW_PDF_DELETE_FAILED);
        }
    }
}
