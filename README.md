<div align="center">
  <img width="200" src="https://github.com/user-attachments/assets/c0600c88-a8f7-4a80-8269-7ba1104ca3c0"/> 
  <br />

  ### 기억을 기록으로, 면접 복기 서비스 Refit

  <p>
    <a href="https://www.notion.so/API-2f4b4f683005812a91bfe40c54942d77?source=copy_link">API 명세 (임시)</a>
    &nbsp; | &nbsp; 
    <a href="https://jira.external-share.com/issue/433665/lookback">Jira Board</a>
    &nbsp; | &nbsp;
    <a href="https://www.figma.com/design/1bTgPqgo2ISeKo9rg0uXVY/-4%ED%8C%80--%EC%B5%9C%EC%A2%85%EC%82%B0%EC%B6%9C%EB%AC%BC-%ED%95%B8%EB%93%9C%EC%98%A4%ED%94%84?node-id=11706-13638&t=d15cAGb98gYZbypL-1">Figma</a>
    &nbsp; | &nbsp; 
    <a href="https://github.com/boostcampwm2023/web13_Boarlog/wiki">GitHub Wiki</a>
  </p>
</div>


<!-- [![Wiki](https://img.shields.io/badge/기록_정리_(Wiki)-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/softeerbootcamp-7th/Team4-Refit/wiki)
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

## 목차

1. [기술 아티클](#기술-아티클)
2. [서비스 소개](#서비스-소개)
3. [협업 프로세스](#협업-프로세스)
4. [프론트엔드](#프론트엔드)
5. [백엔드](#백엔드)
6. [팀원 소개](#팀원-소개)


<br/>

## 기술 아티클 
|파트|제목|작성자|
|---|---|---| 
|공통|작성 예정|홍지운|
|FE|작성 예정|홍지운|
|FE|작성 예정|황주희|
|BE|작성 예정|권찬|
|BE|작성 예정|송영범|
|BE|작성 예정|이장안|


<!-- 더 많은 기술 아티클은  [📝 Refit-Wiki](https://github.com/softeer5th/Team2-Getit/wiki) 페이지에서 볼 수 있어요. -->



## 서비스 소개

리핏은 면접 경험을 체계적으로 관리할 수 있도록 도와주는 면접 복기 서비스에요. 

리핏 팀에서 22명의 취준생을 대상으로 유저 인터뷰를 시행한 결과, **면접 복기를 제대로 하지 못해서 면접 경험이 유의미한 자산으로 남지 못하는** 문제를 발견했어요. 이를 해결하기 위해 면접 복기를 세 단계로 구조화하고, 각 단계에 맞는 핵심기능을 설계했어요.
<br/>

<img src="https://github.com/user-attachments/assets/e6246550-349e-4342-b0cc-36bd562657c7" />

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

## 협업 프로세스
리핏 팀은 Jira를 기반으로 업무를 관리하고, 1주 단위 스프린트를 운영해요. Jira와 GitHub을 이중으로 관리하는 수고로움을 줄이고, 팀에서 정한 Git 컨벤션을 지키기 위해 Jira Automation을 사용했어요.
<br/>

| 스프린트 명 | 스프린트 기간 | 내용                                                                                                                    |
| ----------- | -------------- |-----------------------------------------------------------------------------------------------------------------------|
| Refit 1주차 | 26-01-19 ~ 26-01-25 | FE: 주요 기능들 피저빌리티 체크, 기본 프로젝트 세팅<br/>BE: API 명세 및 ERD 설계<br/> 공통: 기획/디자인 리뷰 및 수정, Git 컨벤션 설정, Jira Automation 구현       |
| Refit 2주차 | 26-01-26 ~ 26-02-02 | FE: 기본적인 뷰 구현, OpenAPI workflow 개발 <br/> BE: Whisper, Google STT 등 프로젝트 적용 예정 기술 성능 검토, 프로젝트 공통 컴포넌트 개발, OAuth 로그인 개발 |


- 티켓 생성 → To Do → In Progress → Code Review → Done
- 논의 및 결정 사항은 Wiki / Notion에 정리하여 공유



<br/>

## 프론트엔드
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


## 백엔드
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
<img src="https://github.com/user-attachments/assets/eed01b33-b71e-4882-b6d2-83331ad5249a">

## 팀원 소개

| [권찬](https://github.com/kckc0608) | [송영범](https://github.com/zxc534) | [이장안](https://github.com/lja3723) | [홍지운](https://github.com/forhyundaisofteer) | [황주희](https://github.com/HIHJH) |
|:--:|:--:|:--:|:--:|:--:|
| <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A4HAETKM5-62e6d3ed8b99-512" /> | <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A5SBGK2HE-b41f95559171-512" /> | <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A4FKK090X-9bb3c968f4fb-512" /> | <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A597QMUKT-7b06f93d26d0-512" /> | <img width="160" src="https://ca.slack-edge.com/T09M55L7F6Y-U0A489XSA2H-1b753408a2fc-512" /> |
| **BE** | **BE** | **BE** | **Lead / FE** | **FE** |

