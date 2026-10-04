package com.portfolio.backend.service.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileStorageStrategy {
    String upload(MultipartFile file) throws IOException;
}