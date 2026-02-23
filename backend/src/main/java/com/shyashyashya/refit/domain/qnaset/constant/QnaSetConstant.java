package com.shyashyashya.refit.domain.qnaset.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class QnaSetConstant {

    public static final int QUESTION_TEXT_MAX_LENGTH = 200;
    public static final int ANSWER_TEXT_MAX_LENGTH = 10_000;
    public static final int QNA_SET_REVIEW_TEXT_MAX_LENGTH = 500;
    public static final int HIGHLIGHTING_TEXT_MAX_LENGTH = 2_000;
}
