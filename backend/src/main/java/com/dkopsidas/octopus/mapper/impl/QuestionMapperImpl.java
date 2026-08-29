package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.dto.AnswerResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Question;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.mapper.QuestionMapper;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;


@Component
public class QuestionMapperImpl implements QuestionMapper {
    @Override
    public Question toEntity(CreateQuestionRequestDto dto, Course courseById) {
        Question question = new Question(
                null,
                dto.title(),
                dto.imageUrl(),
                true,
                new ArrayList<>(),
                courseById,
                Instant.now(),
                Instant.now()
        );

        dto.answers().stream()
                .map(a -> {
                    Answer answer = new Answer();
                    answer.setTitle(a.title());
                    answer.setCorrect(a.isCorrect());
                    return answer;
                })
                .forEach(question::addAnswer);

        return question;
    }

    @Override
    public Question toEntity(UpdateQuestionRequestDto dto) {
        Question question = new Question(
                null,
                dto.title(),
                dto.imageUrl(),
                dto.isActive(),
                new ArrayList<>(),
                null,
                null,
                Instant.now()
        );

        dto.answers().stream()
                .map(a -> {
                    Answer answer = new Answer();
                    answer.setTitle(a.title());
                    answer.setCorrect(a.isCorrect());
                    return answer;
                })
                .forEach(question::addAnswer);

        return question;
    }

    @Override
    public QuestionResponseDto toDto(Question question) {
        List<AnswerResponseDto> answers = question.getAnswers().stream()
                .map(answer -> new AnswerResponseDto(
                        answer.getId(),
                        answer.getTitle(),
                        answer.getIsCorrect()))
                .toList();

        // Questions created before created_by existed have no author yet.
        // publicName() honours the author's display preference -- printing
        // getDisplayName() here ignored it and always showed the real name.
        User creator = question.getCreatedBy();

        return new QuestionResponseDto(
                question.getId(),
                question.getTitle(),
                question.getImageUrl(),
                question.getIsActive(),
                answers,
                question.getCourse().getId(),
                creator != null ? creator.getId() : null,
                creator != null ? creator.publicName() : null
        );
    }

    public List<QuestionResponseDto> toDto(List<Question> questionList) {
        return questionList.stream()
                .map(this::toDto)
                .toList();
    }
}
