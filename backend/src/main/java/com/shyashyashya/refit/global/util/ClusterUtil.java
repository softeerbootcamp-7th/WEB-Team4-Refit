package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.batch.model.CategoryVectorDocument;
import com.shyashyashya.refit.batch.model.QuestionVectorDocument;
import java.util.List;

public interface ClusterUtil {

    List<CategoryVectorDocument> createClusters(List<QuestionVectorDocument> documents);

    CategoryVectorDocument mapToCluster(QuestionVectorDocument document);
}
