package com.shyashyashya.refit.domain.scrapfolder.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.SCRAP_FOLDER_NOT_ACCESSIBLE;

import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import org.springframework.stereotype.Component;

@Component
public class ScrapFolderValidator {

    public void validateScrapFolderOwner(ScrapFolder scrapFolder, User user) {
        if (!scrapFolder.getUser().equals(user)) {
            throw new CustomException(SCRAP_FOLDER_NOT_ACCESSIBLE);
        }
    }
}
