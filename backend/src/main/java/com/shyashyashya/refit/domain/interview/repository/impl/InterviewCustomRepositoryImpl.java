package com.shyashyashya.refit.domain.interview.repository.impl;

import static com.shyashyashya.refit.domain.interview.model.QInterview.interview;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.interview.repository.InterviewCustomRepository;
import com.shyashyashya.refit.domain.user.model.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@RequiredArgsConstructor
public class InterviewCustomRepositoryImpl implements InterviewCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Page<Interview> searchInterviews(
            User user,
            String keyword,
            Set<InterviewType> interviewTypes,
            Set<InterviewResultStatus> interviewResultStatuses,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {
        BooleanExpression[] searchConditions = {
            interview.user.eq(user),
            interview.reviewStatus.eq(InterviewReviewStatus.DEBRIEF_COMPLETED),
            companyNameContains(keyword),
            interviewTypesIn(interviewTypes),
            interviewResultStatusIn(interviewResultStatuses),
            interviewDateIsAfter(startDate),
            interviewDateIsBefore(endDate)
        };

        List<Interview> interviews = jpaQueryFactory
                .selectFrom(interview)
                .where(searchConditions)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long totalSize = jpaQueryFactory
                .select(interview.count())
                .from(interview)
                .where(searchConditions)
                .fetchOne();
        totalSize = totalSize == null ? 0L : totalSize;

        return new PageImpl<>(interviews, pageable, totalSize);
    }

    @Override
    public List<Interview> findInterviewsNotLoggedRecentOneMonth(User user, LocalDateTime now) {
        return jpaQueryFactory
                .selectFrom(interview)
                .where(
                        interview.user.eq(user),
                        interview.reviewStatus.eq(InterviewReviewStatus.NOT_LOGGED),
                        interview.startAt.between(now.minusDays(30), now))
                .orderBy(interview.startAt.desc())
                .fetch();
    }

    private BooleanExpression companyNameContains(String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return null;
        }
        return interview.company.name.containsIgnoreCase(keyword);
    }

    private BooleanExpression interviewTypesIn(Set<InterviewType> interviewTypes) {
        if (interviewTypes == null || interviewTypes.isEmpty()) {
            return null;
        }
        return interview.interviewType.in(interviewTypes);
    }

    private BooleanExpression interviewResultStatusIn(Set<InterviewResultStatus> interviewResultStatuses) {
        if (interviewResultStatuses == null || interviewResultStatuses.isEmpty()) {
            return null;
        }
        return interview.resultStatus.in(interviewResultStatuses);
    }

    private BooleanExpression interviewDateIsAfter(LocalDate startDate) {
        if (startDate == null) {
            return null;
        }
        return interview.startAt.goe(startDate.atStartOfDay());
    }

    private BooleanExpression interviewDateIsBefore(LocalDate endDate) {
        if (endDate == null) {
            return null;
        }
        return interview.startAt.before(endDate.plusDays(1).atStartOfDay());
    }
}
