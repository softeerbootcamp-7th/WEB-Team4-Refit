package com.shyashyashya.refit.integration.user;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.user.dto.request.MyProfileUpdateRequest;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpRequest;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.exception.ErrorCode;
import com.shyashyashya.refit.integration.core.IntegrationTest;
import io.restassured.http.ContentType;
import java.time.Instant;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class UserIntegrationTest extends IntegrationTest {

    @Nested
    class 회원가입 {

        @Test
        void 회원가입을_성공하면_토큰을_발급한다() {
            // given
            String newEmail = "newuser@example.com";
            String newNickname = "newNickname";
            String newProfileImageUrl = "http://profile.com/img.jpg";
            Industry newIndustry = industry1;
            JobCategory newJobCategory = jobCategory1;
            Instant now = Instant.now();
            // Guest Token (userId = null)
            String guestAccessToken = jwtEncoder.encodeAccessJwt(newEmail, null, now);
            String guestRefreshToken = jwtEncoder.encodeRefreshJwt(newEmail, null, now);

            UserSignUpRequest request = new UserSignUpRequest(
                    newNickname,
                    newProfileImageUrl,
                    newIndustry.getId(),
                    newJobCategory.getId());

            // when
            given()
                    .port(port)
                    .cookie(AuthConstant.ACCESS_TOKEN, guestAccessToken)
                    .cookie(AuthConstant.REFRESH_TOKEN, guestRefreshToken)
                    .contentType(ContentType.JSON)
                    .body(request)
                    .when()
                    .post("/user/signup")
                    .then()
                    .statusCode(HttpStatus.OK.value())
                    .cookie(AuthConstant.ACCESS_TOKEN, notNullValue())
                    .cookie(AuthConstant.REFRESH_TOKEN, notNullValue());

            // then
            User savedUser = userRepository.findByEmail(newEmail).orElseThrow();
            assertThat(savedUser.getNickname()).isEqualTo("newNickname");
            assertThat(savedUser.getIndustry().getId()).isEqualTo(industry1.getId());
        }

        @Test
        void 이미_가입된_이메일로_가입하면_409_Conflict_반환한다() {
            // given
            // requestUser는 이미 가입된 유저, Guest Token으로 위장하여 가입 시도
            String existingEmail = requestUser.getEmail();
            Instant now = Instant.now();
            String guestAccessToken = jwtEncoder.encodeAccessJwt(existingEmail, null, now);
            String guestRefreshToken = jwtEncoder.encodeRefreshJwt(existingEmail, null, now);

            UserSignUpRequest request = new UserSignUpRequest(
                    "anotherNick",
                    "img",
                    industry1.getId(),
                    jobCategory1.getId());

            // when & then
            given()
                    .port(port)
                    .cookie(AuthConstant.ACCESS_TOKEN, guestAccessToken)
                    .cookie(AuthConstant.REFRESH_TOKEN, guestRefreshToken)
                    .contentType(ContentType.JSON)
                    .body(request)
                    .when()
                    .post("/user/signup")
                    .then()
                    .statusCode(HttpStatus.CONFLICT.value())
                    .body("code", equalTo(ErrorCode.USER_SIGNUP_EMAIL_CONFLICT.name()));
        }
    }

    @Nested
    class 내_정보_조회 {

        @Test
        void 내_정보를_조회한다() {
            given(spec)
                    .when()
                    .get("/user/my")
                    .then()
                    .log().all()
                    .statusCode(HttpStatus.OK.value())
                    .body("result.nickname", equalTo(requestUser.getNickname()));
        }
    }

    @Nested
    class 약관_동의 {

        @Test
        void 약관에_동의한다() {
            // given
            User currentUser = userRepository.findById(requestUser.getId()).orElseThrow();
            assertThat(currentUser.isAgreedToTerms()).isFalse();

            given(spec)
                    .when()
                    .post("/user/my/terms/agree")
                    .then()
                    .log().all()
                    .statusCode(HttpStatus.OK.value())
                    .body("code", equalTo(COMMON200.name())); // ApiResponse structure

            // then
            User user = userRepository.findById(requestUser.getId()).orElseThrow();
            assertThat(user.isAgreedToTerms()).isTrue();
        }

        @Test
        void 이미_동의한_경우_400_Bad_Request_반환한다() {
            // given
            // 먼저 약관 동의 상태로 만듦
            User currentUser = userRepository.findById(requestUser.getId()).orElseThrow();
            currentUser.agreeToTerms();
            userRepository.save(currentUser);

            given(spec)
                    .when()
                    .post("/user/my/terms/agree")
                    .then()
                    .log().all()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", equalTo(ErrorCode.USER_ALREADY_AGREED_TO_TERMS.name()));
        }
    }

    @Nested
    class 내_정보_수정 {

        @Test
        void 내_정보를_수정한다() {
            // given
            MyProfileUpdateRequest request = new MyProfileUpdateRequest(
                    "updatedNickname",
                    industry2.getId(),
                    jobCategory2.getId());

            // when
            given(spec)
                    .contentType(ContentType.JSON)
                    .body(request)
                    .when()
                    .put("/user/my")
                    .then()
                    .log().all()
                    .statusCode(HttpStatus.OK.value());

            // then
            User user = userRepository.findById(requestUser.getId()).orElseThrow();
            assertThat(user.getNickname()).isEqualTo("updatedNickname");
            assertThat(user.getIndustry().getId()).isEqualTo(industry2.getId());
            assertThat(user.getJobCategory().getId()).isEqualTo(jobCategory2.getId());
        }

        @Test
        void 중복된_닉네임으로_수정하면_409_Conflict_반환한다() {
            // given
            // create another user first
            createAndSaveUser("other@test.com", "duplicateNick", industry1, jobCategory1);

            MyProfileUpdateRequest request = new MyProfileUpdateRequest(
                    "duplicateNick",
                    industry1.getId(),
                    jobCategory1.getId());

            // when & then
            given(spec)
                    .contentType(ContentType.JSON)
                    .body(request)
                    .when()
                    .put("/user/my")
                    .then()
                    .log().all()
                    .statusCode(HttpStatus.CONFLICT.value())
                    .body("code", equalTo(ErrorCode.USER_NICKNAME_CONFLICT.name()));
        }
    }
}
