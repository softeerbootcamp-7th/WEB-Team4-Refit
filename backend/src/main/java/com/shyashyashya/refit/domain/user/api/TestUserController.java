package com.shyashyashya.refit.domain.user.api;

import static com.shyashyashya.refit.domain.qnaset.constant.StarAnalysisGenerationConstant.STAR_ANALYSIS_CREATE_REQUEST_TIMEOUT_SEC;
import static com.shyashyashya.refit.global.exception.ErrorCode.TEXT_EMBEDDING_CREATE_FAILED;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NOT_FOUND;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON204;

import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.gemini.GeminiClient;
import com.shyashyashya.refit.global.gemini.GeminiEmbeddingRequest;
import com.shyashyashya.refit.global.gemini.GeminiEmbeddingResponse;
import com.shyashyashya.refit.global.property.GeminiProperty;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Test API", description = "개발용 테스트 API입니다.")
@RestController
@RequestMapping("/test/user")
@RequiredArgsConstructor
@Slf4j
public class TestUserController {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final GeminiClient geminiClient;
    private final Executor geminiPostProcessExecutor;
    private final GeminiProperty geminiProperty;

    @Operation(summary = "(테스트용) 유저를 이메일로 찾아 삭제합니다.")
    @DeleteMapping
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteUserByEmail(@RequestParam @Email String email) {
        userRepository
                .findByEmail(email)
                .map(user -> {
                    userRepository.delete(user);
                    refreshTokenRepository.deleteByEmail(email);
                    return user;
                })
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        var body = ApiResponse.success(COMMON204);
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "(테스트용) 유저를 id로 찾아 삭제합니다.")
    @DeleteMapping("/{userId}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteUserById(@PathVariable Long userId) {
        userRepository
                .findById(userId)
                .map(user -> {
                    userRepository.delete(user);
                    refreshTokenRepository.deleteByEmail(user.getEmail());
                    return user;
                })
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        var body = ApiResponse.success(COMMON204);
        return ResponseEntity.ok(body);
    }

    // TODO API 삭제: Gemini Embedding 생성 테스트용 임시 메소드
    @Operation(summary = "(테스트) 요청 텍스트의 임베딩값을 생성합니다.")
    @PostMapping("/test-embedding")
    public CompletableFuture<ResponseEntity<ApiResponse<GeminiEmbeddingResponse>>> getGeminiEmbedding(
            @RequestBody @NotBlank String text) {

        GeminiEmbeddingRequest requestBody = GeminiEmbeddingRequest.of(
                text, GeminiEmbeddingRequest.TaskType.CLUSTERING, GeminiEmbeddingRequest.OutputDimensionality.D128);

        CompletableFuture<GeminiEmbeddingResponse> reqFuture =
                geminiClient.sendAsyncEmbeddingRequest(requestBody, STAR_ANALYSIS_CREATE_REQUEST_TIMEOUT_SEC);

        CompletableFuture<GeminiEmbeddingResponse> result = reqFuture
                .thenApplyAsync(response -> response, geminiPostProcessExecutor)
                .exceptionally(e -> {
                    log.error(e.getMessage(), e);
                    throw new CustomException(TEXT_EMBEDDING_CREATE_FAILED);
                });

        return result.thenApply(rsp -> ResponseEntity.ok(ApiResponse.success(COMMON200, rsp)));
    }
}
