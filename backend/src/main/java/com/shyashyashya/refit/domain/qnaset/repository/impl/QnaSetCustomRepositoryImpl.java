package com.shyashyashya.refit.domain.qnaset.repository.impl;

import static com.shyashyashya.refit.domain.qnaset.model.QQnaSet.qnaSet;
import static com.shyashyashya.refit.domain.qnaset.model.QStarAnalysis.starAnalysis;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCustomRepository;
import com.shyashyashya.refit.domain.user.model.User;
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
            List<StarInclusionLevel> sInclusionLevels,
            List<StarInclusionLevel> tInclusionLevels,
            List<StarInclusionLevel> aInclusionLevels,
            List<StarInclusionLevel> rInclusionLevels,
            Pageable pageable) {
        BooleanExpression[] searchConditions = {
            qnaSet.interview.user.eq(user),
            containsKeyword(keyword),
            starInclusionLevelsConditions(
                    hasStarAnalysis, sInclusionLevels, tInclusionLevels, aInclusionLevels, rInclusionLevels)
        };

        List<QnaSet> contents = queryFactory
                .selectFrom(qnaSet)
                .leftJoin(starAnalysis)
                .on(starAnalysis.qnaSet.eq(qnaSet))
                .where(searchConditions)
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

    private BooleanExpression containsIndustryIds(List<Long> industryIds) {
        if (industryIds == null || industryIds.isEmpty()) {
            return null;
        }
        return qnaSet.interview.industry.id.in(industryIds);
    }

    private BooleanExpression containsJobCategoryIds(List<Long> jobCategoryIds) {
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
            List<StarInclusionLevel> sLevels,
            List<StarInclusionLevel> tLevels,
            List<StarInclusionLevel> aLevels,
            List<StarInclusionLevel> rLevels) {

        if (Boolean.FALSE.equals(hasStarInclusionLevels)) {
            return starAnalysis.isNull();
        }

        BooleanExpression starAnalysisLevelConditions = null;

        if (sLevels != null && !sLevels.isEmpty()) {
            starAnalysisLevelConditions = starAnalysis.sInclusionLevel.in(sLevels);
        }

        if (tLevels != null && !tLevels.isEmpty()) {
            starAnalysisLevelConditions = starAnalysisLevelConditions == null
                    ? starAnalysis.tInclusionLevel.in(tLevels)
                    : starAnalysisLevelConditions.and(starAnalysis.tInclusionLevel.in(tLevels));
        }

        if (aLevels != null && !aLevels.isEmpty()) {
            starAnalysisLevelConditions = starAnalysisLevelConditions == null
                    ? starAnalysis.aInclusionLevel.in(aLevels)
                    : starAnalysisLevelConditions.and(starAnalysis.aInclusionLevel.in(aLevels));
        }

        if (rLevels != null && !rLevels.isEmpty()) {
            starAnalysisLevelConditions = starAnalysisLevelConditions == null
                    ? starAnalysis.rInclusionLevel.in(rLevels)
                    : starAnalysisLevelConditions.and(starAnalysis.rInclusionLevel.in(rLevels));
        }

        if (hasStarInclusionLevels == null) {
            if (starAnalysisLevelConditions == null) {
                return null;
            }
            return starAnalysis.isNull().or(starAnalysis.isNotNull().and(starAnalysisLevelConditions));
        }

        return starAnalysis.isNotNull().and(starAnalysisLevelConditions);
    }
}
