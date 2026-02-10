package com.shyashyashya.refit.domain.scrapfolder.model;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.global.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "qna_sets_scrap_folders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QnaSetScrapFolder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_sets_scrap_folders_id")
    private Long id;

    @JoinColumn(name = "qna_set_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private QnaSet qnaSet;

    @JoinColumn(name = "scrap_folder_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private ScrapFolder scrapFolder;

    /*
     * Static Factory Method
     */
    public static QnaSetScrapFolder create(QnaSet qnaSet, ScrapFolder scrapFolder) {
        return QnaSetScrapFolder.builder()
                .qnaSet(qnaSet)
                .scrapFolder(scrapFolder)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private QnaSetScrapFolder(QnaSet qnaSet, ScrapFolder scrapFolder) {
        this.qnaSet = qnaSet;
        this.scrapFolder = scrapFolder;
    }
}
