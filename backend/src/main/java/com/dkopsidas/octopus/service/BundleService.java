package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CreateBundleRequestDto;
import com.dkopsidas.octopus.domain.dto.BundleResponseDto;


public interface BundleService {

    BundleResponseDto createBundle(CreateBundleRequestDto dto);

    Long countBundle();

    Long countByCourse(Long courseId);
}
