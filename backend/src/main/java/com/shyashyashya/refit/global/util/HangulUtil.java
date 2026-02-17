package com.shyashyashya.refit.global.util;

import org.springframework.stereotype.Component;

@Component
public class HangulUtil {

    // 초성 (19자)
    private static final char[] CHOSUNG = {
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    };

    // 중성 (21자)
    private static final char[] JUNGSUNG = {
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
    };

    // 종성 (28자, 0번째는 종성 없음)
    private static final char[] JONGSUNG = {
        '\0', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ',
        'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    };

    public String decompose(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        StringBuilder result = new StringBuilder();

        for (char c : input.toCharArray()) {

            // 한글 완성형 음절이 아닌 경우는 그대로 추가
            if (!isHangleSyllable(c)) {
                result.append(c);
                continue;
            }

            int code = c - 0xAC00;

            int chosungIndex = code / (21 * 28);
            int jungsungIndex = (code % (21 * 28)) / 28;
            int jongsungIndex = code % 28;

            result.append(CHOSUNG[chosungIndex]);
            result.append(JUNGSUNG[jungsungIndex]);

            // 종성이 있는 경우에만 추가
            if (jongsungIndex > 0) {
                result.append(JONGSUNG[jongsungIndex]);
            }
        }

        return result.toString();
    }

    // '가' ~ '힣' 사이의 한글 완성형 음절인지 확인하는 메서드
    public boolean isHangleSyllable(char c) {
        return 0xAC00 <= c && c <= 0xD7A3;
    }
}
