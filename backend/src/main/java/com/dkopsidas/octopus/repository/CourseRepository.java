package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllBySemester(int semester);
}
