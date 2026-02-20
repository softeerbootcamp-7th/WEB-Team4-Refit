package com.shyashyashya.refit.batch.api;

import com.shyashyashya.refit.batch.service.QuestionCategoryBatchService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Test API", description = "개발용 테스트 API입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/test/batch")
public class BatchTestApi {

    private final QuestionCategoryBatchService questionCategoryBatchService;

    @PostMapping("/clustering-category")
    public ResponseEntity<Void> clusterCategory() {
        questionCategoryBatchService.createCategories();
        return ResponseEntity.ok().build();
    }
}
