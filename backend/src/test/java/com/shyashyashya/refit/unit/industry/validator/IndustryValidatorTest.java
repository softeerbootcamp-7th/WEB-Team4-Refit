package com.shyashyashya.refit.unit.industry.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_PARTIALLY_NOT_FOUND;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.industry.service.validator.IndustryValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class IndustryValidatorTest {

    @Mock
    private IndustryRepository industryRepository;

    @InjectMocks
    private IndustryValidator industryValidator;

    @Test
    void 모든_산업군_ID가_존재할_경우_예외를_발생시키지_않는다() {
        // given
        List<Long> industryIds = List.of(1L, 2L, 3L);
        when(industryRepository.countByIdIn(industryIds)).thenReturn((long) industryIds.size());

        // when & then
        assertDoesNotThrow(() -> industryValidator.validateIndustriesAllExist(industryIds));
    }

    @Test
    void 일부_산업군_ID가_존재하지_않을_경우_404_에러를_발생시킨다() {
        // given
        List<Long> industryIds = List.of(1L, 2L, 3L);
        when(industryRepository.countByIdIn(industryIds)).thenReturn(2L);

        // when
        CustomException exception = assertThrows(CustomException.class,
            () -> industryValidator.validateIndustriesAllExist(industryIds));

        // then
        assertEquals(INDUSTRY_PARTIALLY_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 산업군_ID_목록이_비어있을_경우_예외를_발생시키지_않는다() {
        // given
        List<Long> industryIds = Collections.emptyList();

        // when & then
        assertDoesNotThrow(() -> industryValidator.validateIndustriesAllExist(industryIds));
    }

    @Test
    void 산업군_ID_목록이_null일_경우_예외를_발생시키지_않는다() {
        // given
        List<Long> industryIds = null;

        // when & then
        assertDoesNotThrow(() -> industryValidator.validateIndustriesAllExist(industryIds));
    }
}
