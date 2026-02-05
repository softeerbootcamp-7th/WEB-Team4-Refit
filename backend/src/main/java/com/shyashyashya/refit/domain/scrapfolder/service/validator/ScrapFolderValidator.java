package com.shyashyashya.refit.domain.scrapfolder.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.SCRAP_FOLDER_NAME_DUPLICATED;
import static com.shyashyashya.refit.global.exception.ErrorCode.SCRAP_FOLDER_NOT_ACCESSIBLE;

import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.repository.ScrapFolderRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScrapFolderValidator {

    public final ScrapFolderRepository scrapFolderRepository;

    public void validateScrapFolderOwner(ScrapFolder scrapFolder, User user) {
        if (!scrapFolder.getUser().getId().equals(user.getId())) {
            throw new CustomException(SCRAP_FOLDER_NOT_ACCESSIBLE);
        }
    }

    public void validateScrapFolderNameNotDuplicated(String scrapFolderName, User user) {
        if (scrapFolderRepository.existsByNameAndUser(scrapFolderName, user)) {
            throw new CustomException(SCRAP_FOLDER_NAME_DUPLICATED);
        }
    }
}
