package com.shyashyashya.refit.domain.qnaset.repository.impl;

import static com.shyashyashya.refit.domain.qnaset.model.QQnaSet.qnaSet;
import static com.shyashyashya.refit.domain.qnaset.model.QStarAnalysis.starAnalysis;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shyashyashya.refit.domain.qnaset.model.QStarAnalysis;
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
            containsStarAnalysis(starAnalysis, hasStarAnalysis),
            containsStarInclusionLevels(
                    starAnalysis, sInclusionLevels, tInclusionLevels, aInclusionLevels, rInclusionLevels)
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
                .where(searchConditions)
                .fetchOne();
        count = count == null ? 0L : count;

        return new PageImpl<>(contents, pageable, count);
    }

    private BooleanExpression containsKeyword(String keyword) {
        return qnaSet.questionText.contains(keyword);
    }

    private BooleanExpression containsStarAnalysis(QStarAnalysis starAnalysis, Boolean hasStarAnalysis) {
        if (hasStarAnalysis == null) {
            return null;
        }
        if (hasStarAnalysis) {
            return starAnalysis.isNotNull();
        }
        return starAnalysis.isNull();
    }

    private BooleanExpression containsStarInclusionLevels(
            QStarAnalysis s,
            List<StarInclusionLevel> sLevels,
            List<StarInclusionLevel> tLevels,
            List<StarInclusionLevel> aLevels,
            List<StarInclusionLevel> rLevels) {

        BooleanExpression condition = null;

        if (sLevels != null && !sLevels.isEmpty()) {
            condition = s.sInclusionLevel.in(sLevels);
        }

        if (tLevels != null && !tLevels.isEmpty()) {
            condition =
                    condition == null ? s.tInclusionLevel.in(tLevels) : condition.and(s.tInclusionLevel.in(tLevels));
        }

        if (aLevels != null && !aLevels.isEmpty()) {
            condition =
                    condition == null ? s.aInclusionLevel.in(aLevels) : condition.and(s.aInclusionLevel.in(aLevels));
        }

        if (rLevels != null && !rLevels.isEmpty()) {
            condition =
                    condition == null ? s.rInclusionLevel.in(rLevels) : condition.and(s.rInclusionLevel.in(rLevels));
        }

        return starAnalysis.isNull().or(condition);
    }
}
