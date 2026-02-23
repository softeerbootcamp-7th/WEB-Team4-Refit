package com.shyashyashya.refit.domain.interview.service;

import com.shyashyashya.refit.domain.interview.dto.response.ConvertResultResponse;
import com.shyashyashya.refit.global.dto.ApiResponse;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.async.DeferredResult;

@Component
public class ConvertWaitingMap {

    private final ConcurrentHashMap<Long, DeferredResult<ResponseEntity<ApiResponse<ConvertResultResponse>>>> waiting =
            new ConcurrentHashMap<>();

    public void put(Long requestId, DeferredResult<ResponseEntity<ApiResponse<ConvertResultResponse>>> deferredResult) {
        waiting.put(requestId, deferredResult);
    }

    public Optional<DeferredResult<ResponseEntity<ApiResponse<ConvertResultResponse>>>> remove(Long requestId) {
        return Optional.ofNullable(waiting.remove(requestId));
    }

    public Optional<DeferredResult<ResponseEntity<ApiResponse<ConvertResultResponse>>>> get(Long requestId) {
        return Optional.ofNullable(waiting.get(requestId));
    }
}
