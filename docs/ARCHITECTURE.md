# 아키텍처

## 디렉토리 구조
src/
├── app/            # 페이지 라우트 (/, /quiz, /result) — Expo Router
├── components/     # UI 컴포넌트
├── store/          # Zustand 퀴즈 상태
├── data/           # 퀴즈 문항 정적 데이터
├── lib/            # 애니메이션 variants, 유틸
└── types/          # TypeScript 타입 정의

## 데이터 흐름
data/questions.ts → QuizCard → quizStore → ResultCard

## 상태 관리
- 전역 상태: Zustand (퀴즈 진행 상태, 점수)
- 서버 상태: 없음 (정적 데이터만 사용)