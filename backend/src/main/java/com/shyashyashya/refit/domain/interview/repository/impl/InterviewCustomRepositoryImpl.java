package com.shyashyashya.refit.domain.interview.repository.impl;

import static com.shyashyashya.refit.domain.interview.model.QInterview.interview;
import static com.shyashyashya.refit.global.exception.ErrorCode.SORTING_PROPERTY_NOT_EXISTS;

import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.interview.repository.InterviewCustomRepository;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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
        BooleanExpression[] searchConditions =
                getSearchConditions(user, keyword, interviewTypes, interviewResultStatuses, startDate, endDate);

        List<Interview> interviews = jpaQueryFactory
                .selectFrom(interview)
                .where(searchConditions)
                .orderBy(getSortingConditions(pageable))
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

    @Override
    public List<Interview> findInterviewsNotLoggedRecentOneMonth(User user, LocalDateTime now) {
        return jpaQueryFactory
                .selectFrom(interview)
                .where(
                        interview.user.eq(user),
                        interview.reviewStatus.eq(InterviewReviewStatus.NOT_LOGGED),
                        interview.startAt.between(now.minusMonths(1), now))
                .orderBy(interview.startAt.desc())
                .fetch();
    }

    @Override
    public List<Interview> findAllSimilarInterviewsByUser(User user, Industry industry, JobCategory jobCategory) {
        return jpaQueryFactory
                .selectFrom(interview)
                .where(
                        interview.user.eq(user),
                        interview.industry.eq(industry),
                        interview.jobCategory.eq(jobCategory),
                        interview.reviewStatus.eq(InterviewReviewStatus.DEBRIEF_COMPLETED))
                .orderBy(interview.startAt.desc(), interview.company.name.asc())
                .limit(2)
                .fetch();
    }

    private Expression convertSortPropertyToExpression(String property) {
        return switch (property) {
            case "interviewStartAt" -> interview.startAt;
            case "updatedAt" -> interview.updatedAt;
            case "companyName" -> interview.company.name;
            default -> throw new CustomException(SORTING_PROPERTY_NOT_EXISTS);
        };
    }

    private BooleanExpression[] getSearchConditions(
            User user,
            String keyword,
            Set<InterviewType> interviewTypes,
            Set<InterviewResultStatus> interviewResultStatuses,
            LocalDate startDate,
            LocalDate endDate) {
        return new BooleanExpression[] {
            interview.user.eq(user),
            interview.reviewStatus.eq(InterviewReviewStatus.DEBRIEF_COMPLETED),
            companyNameContains(keyword),
            interviewTypesIn(interviewTypes),
            interviewResultStatusIn(interviewResultStatuses),
            interviewDateIsAfter(startDate),
            interviewDateIsBefore(endDate)
        };
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
