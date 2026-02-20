package com.shyashyashya.refit.global.gemini.generator.resource;

import com.shyashyashya.refit.batch.model.CategoryVectorDocument;
import com.shyashyashya.refit.batch.model.QuestionVectorDocument;

import java.util.List;

public record CategoryNameGenerateResource(
        List<CategoryVectorDocument> clusters,
        List<QuestionVectorDocument> questionVectors
) {}
