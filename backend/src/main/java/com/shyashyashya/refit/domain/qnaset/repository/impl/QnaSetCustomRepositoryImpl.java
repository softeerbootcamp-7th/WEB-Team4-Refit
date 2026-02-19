package com.shyashyashya.refit.domain.qnaset.repository.impl;

import static com.shyashyashya.refit.domain.qnaset.model.QQnaSet.qnaSet;
import static com.shyashyashya.refit.domain.qnaset.model.QStarAnalysis.starAnalysis;
import static com.shyashyashya.refit.global.exception.ErrorCode.SORTING_PROPERTY_NOT_EXISTS;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.QFrequentQnaSetCategoryResponse;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCustomRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RequiredArgsConstructor
public class QnaSetCustomRepositoryImpl implements QnaSetCustomRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<QnaSet> searchByIndustriesAndJobCategories(
            Set<Long> industryIds, Set<Long> jobCategoryIds, Pageable pageable) {
        BooleanExpression[] searchConditions = {
            Expressions.asBoolean(true).isTrue(),
            containsIndustryIds(industryIds),
            containsJobCategoryIds(jobCategoryIds)
        };

        List<QnaSet> qnaSets = queryFactory
                .selectFrom(qnaSet)
                .join(qnaSet.interview)
                .fetchJoin()
                .join(qnaSet.interview.industry)
                .fetchJoin()
                .join(qnaSet.interview.jobCategory)
                .fetchJoin()
                .where(searchConditions)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long totalCount = queryFactory
                .select(qnaSet.count())
                .from(qnaSet)
                .where(searchConditions)
                .fetchOne();
        totalCount = totalCount == null ? 0L : totalCount;

        return new PageImpl<>(qnaSets, pageable, totalCount);
    }

    @Override
    public Page<QnaSet> searchMyQnaSet(
            User user,
            String keyword,
            Boolean hasStarAnalysis,
            Set<StarInclusionLevel> sInclusionLevels,
            Set<StarInclusionLevel> tInclusionLevels,
            Set<StarInclusionLevel> aInclusionLevels,
            Set<StarInclusionLevel> rInclusionLevels,
            Pageable pageable) {

        BooleanExpression[] searchConditions = getSearchConditions(
                user, keyword, hasStarAnalysis, sInclusionLevels, tInclusionLevels, aInclusionLevels, rInclusionLevels);

        List<QnaSet> contents = queryFactory
                .selectFrom(qnaSet)
                .leftJoin(starAnalysis)
                .on(starAnalysis.qnaSet.eq(qnaSet))
                .where(searchConditions)
                .orderBy(getSortingConditions(pageable))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = queryFactory
                .select(qnaSet.count())
                .from(qnaSet)
                .leftJoin(starAnalysis)
                .on(starAnalysis.qnaSet.eq(qnaSet))
                .where(searchConditions)
                .fetchOne();
        count = count == null ? 0L : count;

        return new PageImpl<>(contents, pageable, count);
    }

    @Override
    public Page<FrequentQnaSetCategoryResponse> findFrequentQnaSetCategoryByUser(User user, Pageable pageable) {
        var pageContent = queryFactory
                .select(new QFrequentQnaSetCategoryResponse(
                        qnaSet.qnaSetCategory.id,
                        qnaSet.qnaSetCategory.categoryName,
                        qnaSet.count(),
                        qnaSet.qnaSetCategory.cohesion))
                .from(qnaSet)
                .where(
                        qnaSet.interview.user.eq(user),
                        qnaSet.interview.reviewStatus.eq(InterviewReviewStatus.DEBRIEF_COMPLETED),
                        qnaSet.qnaSetCategory.isNotNull())
                .groupBy(qnaSet.qnaSetCategory)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = queryFactory
                .select(qnaSet.qnaSetCategory.countDistinct())
                .from(qnaSet)
                .where(
                        qnaSet.interview.user.eq(user),
                        qnaSet.interview.reviewStatus.eq(InterviewReviewStatus.DEBRIEF_COMPLETED),
                        qnaSet.qnaSetCategory.isNotNull())
                .groupBy(qnaSet.qnaSetCategory)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetchOne();
        count = count == null ? 0L : count;

        return new PageImpl<>(pageContent, pageable, count);
    }

    @Override
    public Page<QnaSet> findAllDifficultByUser(User user, Pageable pageable) {
        List<QnaSet> contents = queryFactory
                .selectFrom(qnaSet)
                .where(
                        qnaSet.interview.user.eq(user),
                        qnaSet.isMarkedDifficult.isTrue(),
                        qnaSet.interview.reviewStatus.eq(InterviewReviewStatus.DEBRIEF_COMPLETED))
                .orderBy(getSortingConditions(pageable))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = queryFactory.select(qnaSet.count()).from(qnaSet).fetchOne();
        count = count == null ? 0L : count;

        return new PageImpl<>(contents, pageable, count);
    }

    private BooleanExpression[] getSearchConditions(
            User user,
            String keyword,
            Boolean hasStarAnalysis,
            Set<StarInclusionLevel> sInclusionLevels,
            Set<StarInclusionLevel> tInclusionLevels,
            Set<StarInclusionLevel> aInclusionLevels,
            Set<StarInclusionLevel> rInclusionLevels) {
        return new BooleanExpression[] {
            qnaSet.interview.user.eq(user),
            containsKeyword(keyword),
            starInclusionLevelsConditions(
                    hasStarAnalysis, sInclusionLevels, tInclusionLevels, aInclusionLevels, rInclusionLevels)
        };
    }

    private OrderSpecifier<?>[] getSortingConditions(Pageable pageable) {
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
            case "interviewStartAt" -> qnaSet.interview.startAt;
            case "updatedAt" -> qnaSet.updatedAt;
            default -> throw new CustomException(SORTING_PROPERTY_NOT_EXISTS);
        };
    }

    private BooleanExpression containsIndustryIds(Set<Long> industryIds) {
        if (industryIds == null || industryIds.isEmpty()) {
            return null;
        }
        return qnaSet.interview.industry.id.in(industryIds);
    }

    private BooleanExpression containsJobCategoryIds(Set<Long> jobCategoryIds) {
        if (jobCategoryIds == null || jobCategoryIds.isEmpty()) {
            return null;
        }
        return qnaSet.interview.jobCategory.id.in(jobCategoryIds);
    }

    private BooleanExpression containsKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }
        return qnaSet.questionText.contains(keyword);
    }

    private BooleanExpression starInclusionLevelsConditions(
            Boolean hasStarInclusionLevels,
            Set<StarInclusionLevel> sLevels,
            Set<StarInclusionLevel> tLevels,
            Set<StarInclusionLevel> aLevels,
            Set<StarInclusionLevel> rLevels) {

        if (Boolean.FALSE.equals(hasStarInclusionLevels)) {
            return starAnalysis.isNull();
        }

        BooleanBuilder levelConditions = buildStarAnalysisLevelContainsConditions(sLevels, tLevels, aLevels, rLevels);

        if (hasStarInclusionLevels == null) {
            return starAnalysis.isNull().or(starAnalysis.isNotNull().and(levelConditions));
        }

        return starAnalysis.isNotNull().and(levelConditions);
    }

    private BooleanBuilder buildStarAnalysisLevelContainsConditions(
            Set<StarInclusionLevel> sLevels,
            Set<StarInclusionLevel> tLevels,
            Set<StarInclusionLevel> aLevels,
            Set<StarInclusionLevel> rLevels) {
        BooleanBuilder levelConditions = new BooleanBuilder();
        if (sLevels != null && !sLevels.isEmpty()) {
            levelConditions.and(starAnalysis.sInclusionLevel.in(sLevels));
        }

        if (tLevels != null && !tLevels.isEmpty()) {
            levelConditions.and(starAnalysis.tInclusionLevel.in(tLevels));
        }

        if (aLevels != null && !aLevels.isEmpty()) {
            levelConditions.and(starAnalysis.aInclusionLevel.in(aLevels));
        }

        if (rLevels != null && !rLevels.isEmpty()) {
            levelConditions.and(starAnalysis.rInclusionLevel.in(rLevels));
        }

        return levelConditions;
    }
}
