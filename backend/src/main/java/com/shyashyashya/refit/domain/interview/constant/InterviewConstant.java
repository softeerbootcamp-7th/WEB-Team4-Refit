package com.shyashyashya.refit.domain.interview.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class InterviewConstant {

    public static final int RAW_TEXT_MAX_LENGTH = 10_000;
    public static final int KPT_TEXT_MAX_LENGTH = 8_000;
    public static final long QNA_SET_CONVERT_RESULT_TIMEOUT_MILLISECONDS = 120_000L;
}
