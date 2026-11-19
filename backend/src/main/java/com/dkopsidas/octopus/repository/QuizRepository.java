package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.dto.v2.QuizResponseDto;
import com.dkopsidas.octopus.domain.entity.ExamType;
import com.dkopsidas.octopus.domain.entity.Question;
import com.dkopsidas.octopus.domain.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface QuizRepository extends JpaRepository<Quiz, UUID> {

    //  and qq.question.examType = qq.quiz.examType
    /** Questions of a set in order. Skips deactivated questions. */
    @Query("""
            select qq.question from QuizQuestion qq
            where qq.quiz.id = :quizId
              and qq.question.isActive = true
            order by qq.id.position
            """)
    List<Question> findActiveQuestions(UUID quizId);

    /** Quiz list of a course, questionCount counts only the questions findActiveQuestions would serve. */
    @Query("""
            select new com.dkopsidas.octopus.domain.dto.v2.QuizResponseDto(
                q.id, q.course.id, q.examType, q.setNum, cast(count(qu.id) as Integer), q.updated)
            from Quiz q
            left join q.questions qq
            left join qq.question qu on qu.isActive = true
            where q.course.id = :courseId
            group by q.id, q.course.id, q.examType, q.setNum, q.updated
            order by q.examType, q.setNum
            """)
    List<QuizResponseDto> findListByCourseId(Long courseId);

    boolean existsByCourseIdAndExamTypeAndSetNum(Long courseId, ExamType examType, int setNum);
}
