package com.shyashyashya.refit.global.exception;

import com.shyashyashya.refit.global.model.ClientOriginType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class RefreshTokenTheftException extends RuntimeException {
    private final ClientOriginType originType;
}
