package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {

    Optional<CourseProgress> findByUserIdAndCourseId(UUID userId, Long courseId);

    List<CourseProgress> findByUserId(UUID userId);

    void deleteByUserIdAndCourseId(UUID userId, Long courseId);
}
