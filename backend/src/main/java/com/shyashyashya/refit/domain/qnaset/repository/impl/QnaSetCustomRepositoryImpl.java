package com.shyashyashya.refit.domain.qnaset.repository.impl;

import static com.shyashyashya.refit.domain.qnaset.model.QQnaSet.qnaSet;

import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCustomRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@RequiredArgsConstructor
public class QnaSetCustomRepositoryImpl implements QnaSetCustomRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<QnaSet> searchByIndustriesAndJobCategories(
            List<Long> industryIds, List<Long> jobCategoryIds, Pageable pageable) {
        List<QnaSet> qnaSets = queryFactory
                .selectFrom(qnaSet)
                .where(
                        Expressions.asBoolean(true).isTrue(),
                        industryIds == null || industryIds.isEmpty()
                                ? null
                                : qnaSet.interview.industry.id.in(industryIds),
                        jobCategoryIds == null || jobCategoryIds.isEmpty()
                                ? null
                                : qnaSet.interview.jobCategory.id.in(jobCategoryIds))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long totalCount = queryFactory
                .select(qnaSet.count())
                .from(qnaSet)
                .where(
                        Expressions.asBoolean(true).isTrue(),
                        industryIds == null || industryIds.isEmpty()
                                ? null
                                : qnaSet.interview.industry.id.in(industryIds),
                        jobCategoryIds == null || jobCategoryIds.isEmpty()
                                ? null
                                : qnaSet.interview.jobCategory.id.in(jobCategoryIds))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchOne();
        totalCount = totalCount == null ? 0L : totalCount;

        return new PageImpl<>(qnaSets, pageable, totalCount);
    }
}
