package com.shyashyashya.refit.global.config;

import com.google.common.util.concurrent.Futures;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections;
import io.qdrant.client.grpc.Points;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.time.Duration;
import java.util.ArrayList;

@TestConfiguration
public class TestQdrantConfig {

    @Bean
    public QdrantClient qdrantClient() {
        QdrantClient mockClient = Mockito.mock(QdrantClient.class);

        // 1. 초기화(PostConstruct) 관련 스터빙
        // collectionExistsAsync가 호출되면 기본적으로 "true(이미 존재함)"를 반환하여 생성 로직 스킵
        // (만약 생성 로직을 테스트하고 싶다면 개별 테스트 메서드에서 false로 오버라이딩하면 됨)
        Mockito.when(mockClient.collectionExistsAsync(
                Mockito.anyString(),
                Mockito.any(Duration.class)
        )).thenReturn(Futures.immediateFuture(true));

        // 혹시 false가 반환되어 createCollectionAsync가 호출될 경우를 대비한 스터빙
        // Repository는 CreateCollection 객체를 받는 메서드를 사용함
        Mockito.when(mockClient.createCollectionAsync(
                Mockito.any(Collections.CreateCollection.class),
                Mockito.any(Duration.class)
        )).thenReturn(Futures.immediateFuture(
                Collections.CollectionOperationResponse.newBuilder().setResult(true).build()
        ));

        // 2. 저장(Save/Upsert) 관련 스터빙
        Mockito.when(mockClient.upsertAsync(
                Mockito.anyString(),
                Mockito.anyList(),
                Mockito.any(Duration.class)
        )).thenReturn(Futures.immediateFuture(
                Points.UpdateResult.newBuilder().setStatus(Points.UpdateStatus.Completed).build()
        ));

        // 3. 삭제(Delete) 관련 스터빙
        // 3-1. ID 리스트로 삭제 (deleteById)
        Mockito.when(mockClient.deleteAsync(
                Mockito.anyString(),
                Mockito.anyList(),
                Mockito.any(Duration.class)
        )).thenReturn(Futures.immediateFuture(
                Points.UpdateResult.newBuilder().setStatus(Points.UpdateStatus.Completed).build()
        ));

        // 3-2. 필터로 삭제 (deleteAll) - DeletePoints 객체를 받는 메서드
        Mockito.when(mockClient.deleteAsync(
                Mockito.any(Points.DeletePoints.class),
                Mockito.any(Duration.class)
        )).thenReturn(Futures.immediateFuture(
                Points.UpdateResult.newBuilder().setStatus(Points.UpdateStatus.Completed).build()
        ));

        // 4. 검색(Search) 관련 스터빙 (searchSimilar)
        Mockito.when(mockClient.searchAsync(
                Mockito.any(Points.SearchPoints.class),
                Mockito.any(Duration.class)
        )).thenReturn(Futures.immediateFuture(
                new ArrayList<>() // 기본적으로 빈 결과 리스트 반환
        ));

        // 5. 조회(FindById) 관련 스터빙 (retrieveAsync)
        // 인자가 6개인 메서드를 사용 중임 (collection, ids, withPayload, withVectors, consistency, timeout)
        Mockito.when(mockClient.retrieveAsync(
                Mockito.anyString(),
                Mockito.anyList(),
                Mockito.any(Points.WithPayloadSelector.class),
                Mockito.any(Points.WithVectorsSelector.class),
                Mockito.nullable(Points.ReadConsistency.class), // null이 들어갈 수 있음
                Mockito.any(Duration.class)
        )).thenReturn(Futures.immediateFuture(
                new ArrayList<>() // 빈 결과
        ));

        // 6. 전체 조회(FindAll/Scroll) 관련 스터빙 (scrollAsync)
        Mockito.when(mockClient.scrollAsync(
                Mockito.any(Points.ScrollPoints.class),
                Mockito.any(Duration.class)
        )).thenReturn(Futures.immediateFuture(
                Points.ScrollResponse.newBuilder().build() // 빈 응답
        ));

        // 7. 수정(UpdatePayload) 관련 스터빙
        Mockito.when(mockClient.setPayloadAsync(
                Mockito.any(Points.SetPayloadPoints.class),
                Mockito.any(Duration.class)
        )).thenReturn(Futures.immediateFuture(
                Points.UpdateResult.newBuilder().setStatus(Points.UpdateStatus.Completed).build()
        ));

        return mockClient;
    }
}
