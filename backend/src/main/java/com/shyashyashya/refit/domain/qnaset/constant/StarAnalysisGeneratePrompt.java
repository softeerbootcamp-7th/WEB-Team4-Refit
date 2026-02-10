package com.shyashyashya.refit.domain.qnaset.constant;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;

public final class StarAnalysisGeneratePrompt {

    private StarAnalysisGeneratePrompt() {}

    private static final String PROMPT_TEMPLATE_HEADER = """
            너는 면접 답변을 구조적으로 분석하는 도우미다.
            답변의 좋고 나쁨을 평가하거나 점수화하지 말고,
            STAR 기법 기준으로 구조적 요소의 포함 수준만 판단하라.

            STAR 정의는 다음과 같다:

            - Situation (S): 상황, 배경, 문제 발생 맥락
              → 언제, 어떤 환경에서, 어떤 문제가 발생했는지가 제3자가 이해 가능해야 한다.

            - Task (T): 당시 본인의 역할, 책임, 해결해야 했던 과제
              → 팀이 아닌 ‘본인’에게 주어진 역할이나 책임이 명확히 드러나야 한다.

            - Action (A): 본인이 실제로 수행한 구체적인 행동
              → 단순 참여가 아니라, 무엇을 어떻게 했는지가 드러나야 한다.

            - Result (R): 행동의 결과, 성과, 변화 또는 배운 점
              → 수치, 전후 비교, 명확한 변화 중 하나 이상이 포함되어야 한다.

            ---

            각 요소는 아래 3단계 중 하나로 판단한다:

            - "PRESENT"
              → 해당 요소가 명시적으로 언급되었고,
                내용이 구체적이며 제3자가 읽어도 충분히 이해 가능하다.

            - "INSUFFICIENT"
              → 요소가 언급되었으나,
                추상적이거나 설명이 짧아 맥락·행동·결과가 충분히 드러나지 않는다.

            - "ABSENT"
              → 해당 요소에 대한 언급이 전혀 없다.

            ---

            판단 시 공통 규칙:

            - 암시적 언급은 반드시 "INSUFFICIENT"으로 판단한다.
            - 역할, 행동, 결과가 불명확한 경우 "PRESENT"으로 판단하지 마라.
            - 단순한 표현
              (예: “회의를 진행했다”, “문제가 줄었다”, “잘 마무리되었다”)는
              구체적 설명이 없을 경우 반드시 "INSUFFICIENT"이다.
            - 판단이 애매한 경우에는 반드시 "INSUFFICIENT"으로 판단하라.
            - 평가, 점수화, 조언은 하지 말고 구조적 판단만 수행한다.

            ---

            아래 면접 답변을 STAR 기준으로 분석하라.

            [면접 질문]
            {question}

            [면접 답변]
            {answer}

            """;

    private static final String PROMPT_TEMPLATE_TAIL = """
            ---

            반드시 아래 JSON 형식으로만 출력하라.
            JSON 외의 텍스트는 절대 출력하지 마라.

            {
              "S": "PRESENT | INSUFFICIENT | ABSENT",
              "T": "PRESENT | INSUFFICIENT | ABSENT",
              "A": "PRESENT | INSUFFICIENT | ABSENT",
              "R": "PRESENT | INSUFFICIENT | ABSENT",
              "overall_summary": "string"
            }
            """;

    public static String buildPrompt(QnaSet qnaSet) {
        // StringBuilder를 사용하여도 성능 이점이 없음.
        // append 횟수가 가변이 아니고 분기에 따라 달라지지 않음.
        // 자바 컴파일러는 아래처럼 단순한 + 연결을 만나도 내부적으로는 어차피 StringBuilder
        // (또는 JDK 9+에서는 invokedynamic 기반 StringConcatFactory)로 최적화
        return PROMPT_TEMPLATE_HEADER + "[면접 질문]"
                + qnaSet.getQuestionText()
                + "\n" + "[면접 답변]"
                + qnaSet.getAnswerText()
                + "\n" + PROMPT_TEMPLATE_TAIL;
    }
}
