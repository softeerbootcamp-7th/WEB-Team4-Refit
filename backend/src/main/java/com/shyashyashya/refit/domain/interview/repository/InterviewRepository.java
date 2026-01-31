package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.user.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findAllByUser(User user);
}
