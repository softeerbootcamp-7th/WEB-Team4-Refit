package com.shyashyashya.refit.domain.qnaset;

import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QnaSetService {

    @Transactional
    public void updateQnaSet(Long qnaSetId, QnaSetUpdateRequest request) {}
}
