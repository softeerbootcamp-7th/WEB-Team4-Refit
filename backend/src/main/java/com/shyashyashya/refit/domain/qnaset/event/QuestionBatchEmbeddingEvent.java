package com.shyashyashya.refit.domain.qnaset.event;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import java.util.List;

public record QuestionBatchEmbeddingEvent(List<QnaSet> qnaSets) {}
