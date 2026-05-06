package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.CreatePlayerRequest;
import com.dkopsidas.octopus.domain.UpdatePlayerRequest;
import com.dkopsidas.octopus.domain.dto.CourseDto;
import com.dkopsidas.octopus.domain.dto.CreatePlayerRequestDto;
import com.dkopsidas.octopus.domain.dto.PlayerDto;
import com.dkopsidas.octopus.domain.dto.UpdatePlayerRequestDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Player;
import com.dkopsidas.octopus.mapper.CourseMapper;
import com.dkopsidas.octopus.mapper.PlayerMapper;
import org.springframework.stereotype.Component;

@Component
public class CourseMapperImpl implements CourseMapper {
    @Override
    public CourseDto toDto(Course course) {
        return new CourseDto(
            course.getId(),
            course.getName(),
            course.getSemester()
        );
    }
}
