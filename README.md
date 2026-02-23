<div align="center">
  <img width="200" src="https://github.com/user-attachments/assets/c0600c88-a8f7-4a80-8269-7ba1104ca3c0"/> 
  <br />

  ### 기억을 기록으로, 면접 복기 서비스 Refit

  <p>
    <a href="https://api.refit.my/swagger-ui/index.html">Swagger</a>
    &nbsp; | &nbsp; 
    <a href="https://jira.external-share.com/issue/433665/lookback">Jira Board</a>
    &nbsp; | &nbsp;
    <a href="https://www.figma.com/design/1bTgPqgo2ISeKo9rg0uXVY/-4%ED%8C%80--%EC%B5%9C%EC%A2%85%EC%82%B0%EC%B6%9C%EB%AC%BC-%ED%95%B8%EB%93%9C%EC%98%A4%ED%94%84?node-id=11706-13638&t=d15cAGb98gYZbypL-1">Figma</a>
    &nbsp; | &nbsp; 
    <a href="https://github.com/softeerbootcamp-7th/WEB-Team4-Refit/wiki">GitHub Wiki</a>
  </p>
</div>


<!-- Wiki](https://img.shields.io/badge/기록_정리_(Wiki)-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/softeerbootcamp-7th/Team4-Refit/wiki)
[![Jira](https://img.shields.io/badge/태스크_관리_(Jira)-0052CC?style=for-the-badge&logo=jira&logoColor=white)](https://shashasha.atlassian.net/jira/software/c/projects/DEV/boards/5/backlog)
[![Notion](https://img.shields.io/badge/협업_문서_(Notion)-000000?style=for-the-badge&logo=notion&logoColor=white)](https://notion.example.com)
[![Figma](https://img.shields.io/badge/디자인_(Figma)-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://figma.example.com) -->

<!-- [![Static Badge](https://img.shields.io/badge/Jira%20Board-1768DB?style=flat&logo=jira)](https://jira.external-share.com/issue/433665/lookback)
![Static Badge](https://img.shields.io/badge/GitHub%20Wiki-231817?style=flat&logo=github) -->
<!-- - 📋 [요구사항 정의서](https://docs.google.com/spreadsheets/u/1/d/1Qe8E4XaZgPwHOEgwlmjB70HpnB9G-C4gSOup_Nljm3Q/edit?gid=0#gid=0)
- 📘 [주요 정책 정의서](https://docs.google.com/spreadsheets/u/1/d/1Op5Npa2M0kBZRef8tnQQ7309OXxiwqvzN6RDAVu-ux4/edit?gid=533613928#gid=533613928)
- 🎨 [와이어프레임](https://www.figma.com/design/1bTgPqgo2ISeKo9rg0uXVY/-4%ED%8C%80--%EC%B5%9C%EC%A2%85%EC%82%B0%EC%B6%9C%EB%AC%BC-%ED%95%B8%EB%93%9C%EC%98%A4%ED%94%84?node-id=8-17111&m=dev)
- 🖥️ [화면 디자인](https://www.figma.com/design/1bTgPqgo2ISeKo9rg0uXVY/-4%ED%8C%80--%EC%B5%9C%EC%A2%85%EC%82%B0%EC%B6%9C%EB%AC%BC-%ED%95%B8%EB%93%9C%EC%98%A4%ED%94%84?node-id=1-6&m=dev)
- 🌱 [디자인 시스템](https://www.figma.com/design/W7b1Hf8yXwhTe8kDmxvtio/-4%ED%8C%80--Design-System?node-id=0-1&m=dev) -->

</div>

## 📋 목차

1. [서비스 소개](#-서비스-소개)
2. [팀원 소개](#-팀원-소개)
3. [협업](#-협업)
4. [프론트엔드](#-프론트엔드)
5. [백엔드](#-백엔드)

<br/>

## 🎤 서비스 소개
리핏은 면접 경험을 체계적으로 관리할 수 있도록 도와주는 면접 복기 서비스에요. 

리핏 팀에서 22명의 취준생을 대상으로 유저 인터뷰를 시행한 결과, **면접 복기를 제대로 하지 못해서 면접 경험이 유의미한 자산으로 남지 못하는** 문제를 발견했어요. 이를 해결하기 위해 면접 복기를 세 단계로 구조화하고, 각 단계에 맞는 핵심기능을 설계했어요.
<br/>

<img alt="Screenshot 2026-01-30 at 2 17 15 PM" src="https://github.com/user-attachments/assets/f289d34a-25cf-49b7-9868-8abbc499a2c0" />

### 면접 질답 기록 단계
* 형식 고민 없이 글이나 음성으로 편하게 면접 내용을 입력하면, AI가 질문과 답변을 자동으로 분류해줘요.
* 면접 질문이 자소서의 어느 부분에서 나왔는지 하이라이트로 표시해 서로 묶을 수 있어요.
* 대면 면접 직후에도 편하게 기록할 수 있게 모바일 웹을 지원해요.

### 면접 회고 기록 단계
* 자동 분류된 질답에 개별 회고를 남길 수 있어요.
* AI가 내 답변을 [STAR 기법](https://en.wikipedia.org/wiki/Situation,_task,_action,_result)으로 분석해, 부족한 점이 무엇인지 알려줘요.
* 한 면접에 대한 전체적인 회고를 할 수 있게 [KPT 기법](https://techblog.woowahan.com/2677)을 지원해요.

### 면접 데이터 재사용 단계
* 내 면접 성과를 알기 쉽게 대시보드에서 차트와 그래프로 보여줘요.
* 내 기록뿐만 아니라, 다른 유저들이 공유한 면접 질문도 확인할 수 있어요.
<br/>

## 💻 팀원 소개

| [권찬](https://github.com/kckc0608) | [송영범](https://github.com/zxc534) | [이장안](https://github.com/lja3723) | [홍지운](https://github.com/forhyundaisofteer) | [황주희](https://github.com/HIHJH) |
|:--:|:--:|:--:|:--:|:--:|
| <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A4HAETKM5-62e6d3ed8b99-512" /> | <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A5SBGK2HE-b41f95559171-512" /> | <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A4FKK090X-9bb3c968f4fb-512" /> | <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A597QMUKT-7b06f93d26d0-512" /> | <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A489XSA2H-1b753408a2fc-512" /> |
| **BE** | **BE** | **BE** | **Lead / FE** | **FE** |

<br/>

## 🤝 협업
### 스프린트
리핏 팀은 Jira를 기반으로 업무를 관리하고, 1주 단위로 스프린트를 운영해요. 
<br/>

| 스프린트 명 | 스프린트 기간 | 스프린트 목표 | 백로그 |
|---|---|---|---|
| Refit 1주차 | 26-01-19 ~ 26-01-25 | | [Refit 1주차 백로그](https://shashasha.atlassian.net/jira/software/c/projects/DEV/list?jql=project%20%3D%20%22DEV%22%20AND%20sprint%20%3D%204%20ORDER%20BY%20created%20DESC)|
| Refit 2주차 | 26-01-26 ~ 26-02-01 | | [Refit 2주차 백로그](https://shashasha.atlassian.net/jira/software/c/projects/DEV/list?jql=project%20%3D%20DEV%20AND%20sprint%20%3D%2039%20ORDER%20BY%20created%20DESC)|
| Refit 3주차 | 26-02-02 ~ 26-02-08 | | [Refit 3주차 백로그](https://shashasha.atlassian.net/jira/software/c/projects/DEV/list?jql=project%20%3D%20DEV%0AAND%20assignee%20%3D%20712020%3Aa4e068c2-8139-4e53-88c4-f47f6c6e0bda%0AAND%20status%20%3D%20Done%0AAND%20Sprint%20%3D%20105%0AORDER%20BY%20created%20DESC)|
| Refit 4주차 | 26-02-09 ~ 26-02-15 | | [Refit 4주차 백로그](https://shashasha.atlassian.net/jira/software/c/projects/DEV/list?jql=project%20%3D%20DEV%0AAND%20assignee%20%3D%20712020%3Aa4e068c2-8139-4e53-88c4-f47f6c6e0bda%0AAND%20status%20%3D%20Done%0AAND%20Sprint%20%3D%20138%0AORDER%20BY%20created%20DESC)|
| Refit 5주차 | 26-02-16 ~ 26-02-22 | | [Refit 5주차 백로그](https://shashasha.atlassian.net/jira/software/c/projects/DEV/list?jql=project%20%3D%20DEV%0AAND%20assignee%20%3D%20712020%3Aa4e068c2-8139-4e53-88c4-f47f6c6e0bda%0AAND%20status%20%3D%20Done%0AAND%20Sprint%20%3D%20171%0AORDER%20BY%20created%20DESC)|
 
 <!--
#### Refit 1주차
- [공통] 디자인 핸드오프 파일 보면서 애매한 기획/디자인 모두 픽스 
- [공통] Jira Automation를 이용한 workflow 개발
- [FE] 녹음, 이력서 하이라이트 기능 피저빌리티 체크
- [FE] 프로젝트 스캐폴딩 및 주요 라이브러리 설치
- [BE] API 명세 작성 및 ERD 설계
- [BE] GitHub Action을 이용한 CI/CD 개발 

#### Refit 2주차
- [FE] 캘린더, 녹음, 기록 확인, 이력서 연결 뷰 개발 
- [FE] 공통 컴포넌트 개발 
- [FE] Vercel을 이용한 CI/CD 개발 
- [BE] OAuth 구글 로그인 개발- [BE] Whisper, Google STT API 검토   
-->

<!-- ### Jira Workflow
Jira와 GitHub를 동시에 관리해야 하는 수고를 줄이고 팀의 Git 컨벤션을 일관되게 유지하기 위해 Jira Automation을 이용해 Workflow를 구현했어요. 혼란을 방지하기 위해 Jira에서 발생한 변경만 GitHub에 반영하는 단방향 흐름으로 설계했고, 커스텀 필드들을 만들어 활용했어요.

#### Jira 티켓이 생성될 때
- GitHub Issue가 정해진 형식에 따라 자동 생성
#### Jira 티켓이 수정될 때
- GitHub Issue가 Jira 티켓의 내용을 따라서 자동 수정 
#### Jira 티켓이 In Progress 상태로 이동했을 때
- Origin에 정해진 컨벤션대로 브랜치 생성
- Git fetch && checkout 명령어를 Jira 카드의 커스텀 필드에 주입
#### Jira 티켓이 Code Review 상태로 이동했을 때
- 사전 정의된 양식에 따라 PR을 만들 수 있는 GitHub PR 링크를 Jira 카드의 커스텀 필드에 주입
#### Jira 티켓이 Done 상태로 이동했을 때
- GitHub Issue 라벨을 Done 상태로 변경하고 close

<img width="451" height="710" alt="Screenshot 2026-01-27 at 4 01 53 PM" src="https://github.com/user-attachments/assets/ec9ad1d4-d5f0-412e-a676-99b5e083e664" />

-->



<br/>


## 🐥 프론트엔드

### 📚 기술 아티클 
|파트|제목|작성자|
|---|---|---| 
|FE|작성 예정|홍지운|
|FE|작성 예정|황주희|

### 기술 스택
<table>
    <thead>
        <tr>
            <th>분류</th>
            <th>기술 스택</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                  <p>언어 및 프레임워크</p>
            </td>
            <td>
                  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=ffffff">
                  <img src="https://img.shields.io/badge/React-61DAFB?logo=React&logoColor=black"/>
            </td>
        </tr>
        <tr>
            <td>
                  <p>라이브러리</p>
            </td>
            <td>
                  <img src="https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white"/>
                  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?logo=react-query&logoColor=white"/>
                  <img src="https://img.shields.io/badge/Orval-F53C56?logo=orval&logoColor=white"/>
            </td>
        </tr>
        <tr>
            <td>
                <p>스타일</p>
            </td>
            <td>
              <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white"/>
            </td>
        </tr>
                <tr>
            <td>
                <p>패키지 매니저</p>
            </td>
            <td>
              <img src="https://img.shields.io/badge/Vite-646CFF?logo=Vite&logoColor=white"/>
            </td>
        </tr>
        <tr>
            <td>
                <p>배포</p>
            </td>
            <td>
              <img src="https://img.shields.io/badge/Vercel-000000?logo=Vercel&logoColor=white"/>
<img src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white"/>
            </td>
        </tr>
    </tbody>
</table>

### n8n과 Oval를 활용한 API 명세 자동화
한 달 남짓인 소프티어 프로젝트 개발 기간에서 **API 배포 전까지 프론트엔드 개발을 할 수 없는 것은 큰 병목**이에요. 이를 해결하기 위해 다음과 같은 워크플로우를 도입했어요.
1. **워크플로우 트리거:** Slack의 `/openapi` 명령어를 통해 n8n 자동화 워크플로우를 호출해요.
2. **데이터 추출:** Notion API를 활용하여 자연어로 작성된 노션 API 명세 문서를 정형화된 JSON 데이터로 추출해요.
3. **OAS 생성:** 추출된 JSON을 Gemini LLM에 전달하여 표준화된 OpenAPI Specification(OAS) 파일을 생성해요.
4. **CI/CD 연동:** 생성된 OAS 파일을 GitHub 저장소에 Push하여 명세를 업데이트해요.
5. **개발 환경 동기화:** Oval이 업데이트된 OAS를 기반으로 d.ts와 Mock Server를 생성하여 즉각적인 개발 환경을 최신으로 동기화 시켜요.




<br/>


## 💾 백엔드
### 📚 기술 아티클 
|파트|제목|작성자|
|---|---|---| 
|BE|작성 예정|권찬|
|BE|작성 예정|송영범|
|BE|작성 예정|이장안|
### 기술 스택
<table>
    <thead>
        <tr>
            <th>분류</th>
            <th>기술 스택</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                  <p>언어 및 프레임워크</p>
            </td>
            <td>
                  <img src="https://img.shields.io/badge/java-%23ED8B00.svg?logo=openjdk&logoColor=white">
                  <img src="https://img.shields.io/badge/spring-%236DB33F.svg?logo=spring&logoColor=white"/>
            </td>
        </tr>
        <tr>
            <td>
                <p>의존성 관리 및 빌드</p>
            </td>
            <td>
              <img src="https://img.shields.io/badge/Gradle-02303A.svg?logo=Gradle&logoColor=white"/>
            </td>
        </tr>
        <tr>
            <td>
                <p>배포</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white"/>
                <img src="https://img.shields.io/badge/docker-%230db7ed.svg?logo=docker&logoColor=white"/>
                <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?logo=amazon-aws&logoColor=white"/>
            </td>
        </tr>
        <tr>
            <td>
                <p>데이터베이스</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/mysql-4479A1.svg?logo=mysql&logoColor=white"/>
            </td>
        </tr>
    </tbody>
</table>

### ERD
<img width="2568" height="1272" alt="refit-2" src="https://github.com/user-attachments/assets/bf4180af-3810-4175-8aa1-563f226fdea9" />
<a href="https://api.refit.my/swagger-ui/index.html">ERD Cloud</a>
<br/>

