package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.dto.CreateBundleRequestDto;
import com.dkopsidas.octopus.domain.dto.BundleResponseDto;
import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.entity.Bundle;

import java.util.List;

public interface BundleMapper {

    Bundle toEntity(CreateBundleRequestDto dto, List<Answer> answers);

    BundleResponseDto toDto(Bundle bundle);

    List<BundleResponseDto> toDto(List<Bundle> bundleList);
}
