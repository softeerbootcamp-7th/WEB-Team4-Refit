package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.batch.model.CategoryVectorDocument;
import com.shyashyashya.refit.batch.model.QuestionVectorDocument;
import com.shyashyashya.refit.global.property.ClusteringProperty;
import com.shyashyashya.refit.global.vectordb.model.SingleVectorDocument;
import elki.clustering.ClusteringAlgorithm;
import elki.clustering.hierarchical.HDBSCANLinearMemory;
import elki.clustering.hierarchical.extraction.HDBSCANHierarchyExtraction;
import elki.data.Cluster;
import elki.data.Clustering;
import elki.data.NumberVector;
import elki.data.model.DendrogramModel;
import elki.data.type.TypeUtil;
import elki.database.Database;
import elki.database.StaticArrayDatabase;
import elki.database.ids.DBIDIter;
import elki.database.ids.DBIDRange;
import elki.database.relation.Relation;
import elki.datasource.ArrayAdapterDatabaseConnection;
import elki.distance.CosineDistance;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static com.shyashyashya.refit.global.constant.ClusteringConstant.CATEGORY_VECTOR_QUESTION_DOCUMENT_IDS_KEY;

/**
 * Elki 라이브러리를 활용하여 HDBSCAN 방식으로 클러스터링을 처리하는 구현체입니다.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ElkiClusterUtil implements ClusterUtil {

    private final ClusteringProperty clusteringProperty;

    public record Result(Map<Integer, List<Long>> clusters, List<Long> noise) {}

    @Override
    public List<CategoryVectorDocument> createClusters(
            List<QuestionVectorDocument> documents) {
        Database db = createDatabase(documents);
        db.initialize();

        Relation<NumberVector> relation = db.getRelation(TypeUtil.NUMBER_VECTOR_FIELD);

        // 4) HDBSCAN 계층 생성 (CosineDistance)
        HDBSCANLinearMemory<NumberVector> hdbscan = new HDBSCANLinearMemory<>(CosineDistance.STATIC, clusteringProperty.minPoints());

        // 5) HDBSCAN 계층에서 "클러스터 파티션" 추출
        ClusteringAlgorithm<Clustering<DendrogramModel>> extractor =
                new HDBSCANHierarchyExtraction(hdbscan, clusteringProperty.minSize(), true);

        Clustering<DendrogramModel> clustering = extractor.autorun(db);

        log.debug("[createClusters] allClusters count = " + clustering.getAllClusters().size());
        for (Cluster<DendrogramModel> c : clustering.getAllClusters()) {
            log.debug("[createClusters] cluster name={}, size={}", c.getNameAutomatic(), c.size());
        }

        // 6) ELKI cluster의 DBID를 원래 인덱스(offset)로 변환 후 pointId로 매핑
        DBIDRange idRange = (DBIDRange) relation.getDBIDs();

        Map<Integer, List<Long>> clusters = new LinkedHashMap<>();
        List<Long> noise = new ArrayList<>();

        int clusterIndex = 0;
        for (Cluster<DendrogramModel> cluster : clustering.getAllClusters()) {
            // ELKI는 noise cluster도 "클러스터"로 포함할 수 있음.
            // 관례적으로 이름이 "Noise"인 경우가 많아서 분리 처리(환경에 따라 다를 수 있음).
            boolean isNoise = isNoiseCluster(cluster);

            List<Long> members = new ArrayList<>(Math.max(16, cluster.size()));
            for (DBIDIter it = cluster.getIDs().iter(); it.valid(); it.advance()) {
                int offset = idRange.getOffset(it); // 0..N-1
                members.add(documents.get(offset).getId());
            }

            if (isNoise) {
                noise.addAll(members);
            } else {
                clusters.put(clusterIndex++, members);
            }
        }

        Result result = new Result(clusters, noise);
        log.debug("[createClusters] clusters = " + result.clusters().size());

        return result.clusters.entrySet().stream()
                .map(cluster -> {
                    Integer clusterId = cluster.getKey();
                    List<Long> clusterDocumentIds = cluster.getValue();

                    List<List<Float>> questionEmbeddingsInCluster = documents.stream()
                            .filter(document -> clusterDocumentIds.contains(document.getId()))
                            .map(SingleVectorDocument::getVector)
                            .toList();
                    List<Float> centroidVector = calculateCentroid(questionEmbeddingsInCluster);

                    return CategoryVectorDocument.of(
                            clusterId.longValue(), centroidVector, Map.of(CATEGORY_VECTOR_QUESTION_DOCUMENT_IDS_KEY, clusterDocumentIds));
                })
                .toList();
    }

    @Override
    public CategoryVectorDocument mapToCluster(QuestionVectorDocument document) {
        throw new UnsupportedOperationException("mapToCluster is not yet implemented");
    }

    private Database createDatabase(List<QuestionVectorDocument> documents) {
        double[][] data = new double[documents.size()][];
        for (int i = 0; i < documents.size(); i++) {
            var document = documents.get(i);
            data[i] = document.getVector().stream()
                    .mapToDouble(Number::doubleValue)
                    .toArray();
        }

        return new StaticArrayDatabase(new ArrayAdapterDatabaseConnection(data), null);
    }

    private boolean isNoiseCluster(Cluster<?> c) {
        String name = c.getNameAutomatic();
        if (name == null) return false;
        String n = name.toLowerCase(Locale.ROOT);
        return n.contains("noise");
    }

    private List<Float> calculateCentroid(List<List<Float>> vectors) {
        if (vectors == null || vectors.isEmpty()) {
            return List.of();
        }

        int dim = vectors.get(0).size();
        float[] centroidVector = new float[dim];

        for (List<Float> vector : vectors) {
            for (int i = 0; i < dim; i++) {
                centroidVector[i] += vector.get(i);
            }
        }

        int n = vectors.size();
        List<Float> result = new ArrayList<>(dim);
        for (int i = 0; i < dim; i++) {
            result.add(centroidVector[i] / n);
        }

        return result;
    }
}
