# WavePrompt 
(AI Prompt Archive)

> **1060+ ChatGPT Prompts Library for Creators & Developers**
> **Live Demo:** [https://wavecorestudio.github.io/WavePrompt/](https://wavecorestudio.github.io/WavePrompt/)

**WavePrompt**는 1,060개 이상의 검증된 ChatGPT 프롬프트를 검색하고 활용할 수 있는 웹 애플리케이션입니다.
개발자, 마케터, 크리에이터들이 생산성을 극대화할 수 있도록 **뉴모피즘(Neumorphism)** 디자인을 적용하여 심미적이고 직관적인 사용자 경험을 제공합니다.
<img width="1920" height="1080" alt="cover" src="https://github.com/user-attachments/assets/12af83f2-af78-4560-bfe9-7ea18f033430" />



## Key Features (주요 기능)

* **Massive Database:** 1,060개 이상의 방대한 프롬프트 데이터 탑재 (JSON 기반)
* **Smart Search & Filter:** 키워드 실시간 검색 및 10개 카테고리별 필터링
* **Global Support (i18n):** 한국어/영어 실시간 언어 변환 토글 (Language Toggle)
* **Smart Pagination:** 10단위 점프 및 현재 페이지 요약 알고리즘 적용
* **Auto-Tagging System:** 프롬프트 내용을 분석하여 적절한 해시태그 자동 생성
* **Responsive Design:** 데스크탑(Grid 뷰) 및 모바일(List 뷰) 최적화
* **UX Enhancements:** 원클릭 복사, 스크롤 탑 버튼, 토스트 알림

## 🛠 Tech Stack (기술 스택)

* **Core:** HTML5, CSS3
* **Scripting:** Vanilla JavaScript (ES6+)
* **Design System:** Neumorphism UI (Soft UI)
* **Data Handling:** Google Sheets to JSON Conversion, Async/Await Fetch API
* **Deployment:** GitHub Pages (CI/CD)

## Project Structure

```bash
WavePrompt/
├── index.html       # Semantic Markup & Layout
├── style.css        # Neumorphism Design System & Media Queries
├── script.js        # Core Logic (Search, Pagination, i18n, Data Fetching)
└── data.json        # 1060+ Prompt Database
