package com.shyashyashya.refit.unit.global.util;

import com.shyashyashya.refit.global.util.HangulUtil;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class HangulUtilTest {

    private final HangulUtil hangulUtil = new HangulUtil();

    @Test
    void 받침이_없는_평범한_한글을_자소_분리한다() {
        // given
        String input = "가나다";

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("ㄱㅏㄴㅏㄷㅏ");
    }

    @Test
    void 받침이_있는_한글을_자소_분리한다() {
        // given
        String input = "강물";

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("ㄱㅏㅇㅁㅜㄹ");
    }

    @Test
    void 겹받침이_있는_경우_종성_배열의_문자_그대로_분리된다() {
        // given
        String input = "닭";

        // when
        String result = hangulUtil.decompose(input);

        // then
        // ㄷ + ㅏ + ㄺ (ㄹ,ㄱ으로 나뉘지 않고 ㄺ 한 글자로 나옴)
        assertThat(result).isEqualTo("ㄷㅏㄺ");
    }

    @Test
    void 복합_모음이_포함된_단어를_분리한다() {
        // given
        String input = "왜래종";

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("ㅇㅙㄹㅐㅈㅗㅇ");
    }

    @Test
    void 한글_유니코드_시작과_끝_문자를_테스트한다() {
        // given
        String start = "가"; // 0xAC00
        String end = "힣";   // 0xD7A3

        // when
        String resultStart = hangulUtil.decompose(start);
        String resultEnd = hangulUtil.decompose(end);

        // then
        assertThat(resultStart).isEqualTo("ㄱㅏ");
        assertThat(resultEnd).isEqualTo("ㅎㅣㅎ");
    }

    @Test
    void 한글이_아닌_영어와_숫자는_변경되지_않는다() {
        // given
        String input = "Java2026";

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("Java2026");
    }

    @Test
    void 특수문자와_공백은_변경되지_않는다() {
        // given
        String input = "!@# $";

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("!@# $");
    }

    @Test
    void 한글과_영어가_혼합된_문자열을_정상적으로_처리한다() {
        // given
        String input = "A급코드";

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("Aㄱㅡㅂㅋㅗㄷㅡ");
    }

    @Test
    void 완성형_한글이_아닌_자음이나_모음_낱자는_분해하지_않고_그대로_반환한다() {
        // given
        String input = "ㄱㄴㄷㅏ";

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("ㄱㄴㄷㅏ");
    }

    @Test
    void 빈_문자열이_입력되면_빈_문자열을_반환한다() {
        // given
        String input = "";

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("");
    }

    @Test
    void 입력값이_Null이면_빈_문자열이_반환된다() {
        // given
        String input = null;

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("");
    }

    @Test
    void 한글_음절_판별_메서드를_테스트한다() {
        // given
        char valid = '강';
        char invalid1 = 'A';
        char invalid2 = 'ㄱ';

        // when & then
        assertThat(hangulUtil.isHangleSyllable(valid)).isTrue();
        assertThat(hangulUtil.isHangleSyllable(invalid1)).isFalse();
        assertThat(hangulUtil.isHangleSyllable(invalid2)).isFalse();
    }

    @Test
    void 한글_영어_특수문자_공백이_모두_포함된_문자열을_분리한다() {
        // given
        String input = "운명의 Destiny, 2024!@#, 시작!";

        // when
        String result = hangulUtil.decompose(input);

        // then
        assertThat(result).isEqualTo("ㅇㅜㄴㅁㅕㅇㅇㅢ Destiny, 2024!@#, ㅅㅣㅈㅏㄱ!");
    }
}