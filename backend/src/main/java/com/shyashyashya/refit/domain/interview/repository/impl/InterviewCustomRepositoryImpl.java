package com.shyashyashya.refit.domain.interview.repository.impl;

import static com.shyashyashya.refit.domain.interview.model.QInterview.interview;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.interview.repository.InterviewCustomRepository;
import com.shyashyashya.refit.domain.user.model.User;
import java.time.LocalDate;
import java.util.List;
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
            List<InterviewType> interviewTypes,
            List<InterviewResultStatus> interviewResultStatuses,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {
        List<Interview> interviews = jpaQueryFactory
                .selectFrom(interview)
                .where(
                        interview.user.id.eq(user.getId()),
                        interview.reviewStatus.eq(InterviewReviewStatus.DEBRIEF_COMPLETED),
                        keyword == null || keyword.isEmpty()
                                ? null
                                : interview.company.name.containsIgnoreCase(keyword),
                        interviewTypes == null || interviewTypes.isEmpty()
                                ? null
                                : interview.interviewType.in(interviewTypes),
                        interviewResultStatuses == null || interviewResultStatuses.isEmpty()
                                ? null
                                : interview.resultStatus.in(interviewResultStatuses),
                        startDate == null ? null : interview.startAt.after(startDate.atStartOfDay()),
                        endDate == null
                                ? null
                                : interview.startAt.before(endDate.plusDays(1).atStartOfDay()))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long totalSize = jpaQueryFactory
                .select(interview.count())
                .from(interview)
                .where(
                        interview.user.eq(user),
                        interview.reviewStatus.eq(InterviewReviewStatus.DEBRIEF_COMPLETED),
                        keyword == null || keyword.isEmpty() ? null : interview.jobRole.containsIgnoreCase(keyword),
                        interviewTypes == null || interviewTypes.isEmpty()
                                ? null
                                : interview.interviewType.in(interviewTypes),
                        interviewResultStatuses == null || interviewResultStatuses.isEmpty()
                                ? null
                                : interview.resultStatus.in(interviewResultStatuses),
                        startDate == null ? null : interview.startAt.after(startDate.atStartOfDay()),
                        endDate == null
                                ? null
                                : interview.startAt.before(endDate.plusDays(1).atStartOfDay()))
                .fetchOne();

        return new PageImpl<>(interviews, pageable, totalSize);
    }
}
