package com.shyashyashya.refit.domain.scrapfolder.model;

import com.shyashyashya.refit.domain.user.model.User;
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
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "scrap_folders",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uk_user_scrap_folder_name",
                        columnNames = {"user_id", "scrap_folder_name"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ScrapFolder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scrap_folder_id")
    private Long id;

    @Column(name = "scrap_folder_name", nullable = false, columnDefinition = "varchar(10)")
    private String name;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    /*
     * Static Factory Method
     */
    public static ScrapFolder create(String name, User user) {
        return ScrapFolder.builder().name(name).user(user).build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private ScrapFolder(String name, User user) {
        this.name = name;
        this.user = user;
    }

    public void updateName(String name) {
        this.name = name;
    }
}
