package com.shyashyashya.refit.domain.scrapfolder.repository.impl;

import static com.shyashyashya.refit.domain.scrapfolder.model.QQnaSetScrapFolder.qnaSetScrapFolder;
import static com.shyashyashya.refit.global.exception.ErrorCode.SORTING_PROPERTY_NOT_EXISTS;

import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.repository.QnaSetScrapFolderCustomRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RequiredArgsConstructor
public class QnaSetScrapFolderCustomRepositoryImpl implements QnaSetScrapFolderCustomRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<QnaSet> findQnaSetsByScrapFolder(ScrapFolder scrapFolder, Pageable pageable) {
        List<QnaSet> content = queryFactory
                .select(qnaSetScrapFolder.qnaSet)
                .from(qnaSetScrapFolder)
                .join(qnaSetScrapFolder.qnaSet)
                .fetchJoin()
                .where(qnaSetScrapFolder.scrapFolder.eq(scrapFolder))
                .orderBy(getSortConditions(pageable))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = queryFactory
                .select(qnaSetScrapFolder.qnaSet.count())
                .from(qnaSetScrapFolder)
                .where(qnaSetScrapFolder.scrapFolder.eq(scrapFolder))
                .fetchOne();
        count = count == null ? 0L : count;

        return new PageImpl<>(content, pageable, count);
    }

    private OrderSpecifier<?>[] getSortConditions(Pageable pageable) {
        Sort sort = pageable.getSort();

        if (sort.isUnsorted()) {
            return new OrderSpecifier[] {};
        }

        return sort.stream()
                .map(order -> new OrderSpecifier<>(
                        order.isAscending() ? Order.ASC : Order.DESC,
                        convertSortPropertyToExpression(order.getProperty())))
                .toArray(OrderSpecifier[]::new);
    }

    private Expression convertSortPropertyToExpression(String property) {
        return switch (property) {
            case "interviewStartAt" -> qnaSetScrapFolder.qnaSet.interview.startAt;
            default -> throw new CustomException(SORTING_PROPERTY_NOT_EXISTS);
        };
    }
}
