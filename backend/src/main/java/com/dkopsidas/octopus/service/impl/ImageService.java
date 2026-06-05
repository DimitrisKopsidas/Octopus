package com.dkopsidas.octopus.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.stream.Stream;

@Service
public class ImageService {

    @Value("${app.image.upload-dir}")
    private String uploadDir;

    @Value("${app.image.base-url}")
    private String baseUrl;

    public String saveImage(Long questionId, MultipartFile file) throws IOException {
        String extension = getExtension(file.getOriginalFilename());
        String filename = questionId + extension;
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return baseUrl + "/" + filename;
    }

    public void deleteImage(Long questionId) throws IOException {
        try (Stream<Path> files = Files.list(Paths.get(uploadDir))) {
            files.filter(path -> path.getFileName().toString().startsWith(questionId + "."))
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to delete image", e);
                        }
                    });
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf("."));
    }
}