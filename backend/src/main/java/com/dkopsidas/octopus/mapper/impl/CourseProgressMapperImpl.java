package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.dto.CourseProgressResponseDto;
import com.dkopsidas.octopus.domain.entity.CourseProgress;
import com.dkopsidas.octopus.mapper.CourseProgressMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CourseProgressMapperImpl implements CourseProgressMapper {

    @Override
    public CourseProgressResponseDto toDto(CourseProgress progress) {
        if (progress == null) {
            return null;
        }
        return new CourseProgressResponseDto(
                progress.getId(),
                progress.getUser() != null ? progress.getUser().getId() : null,
                progress.getCourse() != null ? progress.getCourse().getId() : null,
                progress.isFavorite(),
                progress.isPassed()
        );
    }

    @Override
    public List<CourseProgressResponseDto> toDto(List<CourseProgress> courseProgressList) {
        if (courseProgressList == null) {
            return List.of();
        }
        return courseProgressList.stream()
                .map(this::toDto)
                .toList();
    }
}
