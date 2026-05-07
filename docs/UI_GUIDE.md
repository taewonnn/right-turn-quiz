# UI 디자인 가이드

## 디자인 원칙
1. 토스처럼 보여야 한다 — 금융 앱 감성. 깔끔하고 신뢰감 있게. 게임처럼 보이면 안 됨
2. 한 화면에 하나의 질문만 — 인지 부하 최소화. 복잡한 건 다음 화면으로 넘겨라
3. 피드백은 즉각적으로 — 정답/오답 0.2초 안에 반응. 기다리게 하지 마라

## AI 슬롭 안티패턴 — 하지 마라
| 금지 사항 | 이유 |
|-----------|------|
| `expo-blur` BlurView 남용 | glass morphism은 AI 템플릿의 가장 흔한 징후 |
| LinearGradient 텍스트 | AI가 만든 앱 1번 특징. 퀴즈 앱에 어울리지 않음 |
| shadow + 네온 컬러 조합 | 글로우 효과 = AI 슬롭 |
| 보라/인디고 브랜드 색상 | "AI = 보라색" 클리셰. 토스 블루로 통일 |
| 모든 카드에 동일한 borderRadius: 16 | 균일한 둥근 모서리는 템플릿 느낌 |
| 배경 LinearGradient orb 장식 | 모든 AI 앱에 있는 장식. 토스엔 없음 |
| 이모지 남발 | 토스는 이모지 안 씀. 아이콘은 react-native-svg 사용 |

## 색상
### 배경
| 용도 | 값 |
|------|------|
| 페이지 | `#F2F4F6` |
| 카드 | `#FFFFFF` |
| 정답 피드백 배경 | `#E8F9EE` |
| 오답 피드백 배경 | `#FFF0EF` |

### 텍스트
| 용도 | 값 |
|------|------|
| 주 텍스트 | `#191F28` |
| 본문 | `#333D4B` |
| 보조 | `#6B7684` |
| 비활성 | `#B0B8C1` |

### 데이터/시맨틱 색상
| 용도 | 값 |
|------|------|
| 정답/성공 | `#00C853` |
| 오답/에러 | `#FF3B30` |
| 주요 액션 (CTA) | `#3182F6` |
| 비활성 버튼 | `#E5E8EB` |

## 컴포넌트
### 카드
```typescript
{
  borderRadius: 20,
  backgroundColor: '#FFFFFF',
  padding: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,  // Android
}
```

### 버튼
```typescript
// Primary
{ borderRadius: 16, backgroundColor: '#3182F6', height: 56, width: '100%' }

// 정답 선택됨
{ borderRadius: 16, backgroundColor: '#00C853', height: 56 }

// 오답 선택됨
{ borderRadius: 16, backgroundColor: '#FF3B30', height: 56 }

// 비활성
{ borderRadius: 16, backgroundColor: '#E5E8EB', height: 56 }
```

### 프로그레스 바
```typescript
// 트랙
{ height: 4, borderRadius: 2, backgroundColor: '#E5E8EB' }

// 진행
{ height: 4, borderRadius: 2, backgroundColor: '#3182F6' }
// Reanimated useAnimatedStyle로 width 애니메이션
```

## 레이아웃
- 전체 너비: `width: '100%'`, 내부 패딩: `paddingHorizontal: 20`
- 카드 간격: `gap: 12`
- 섹션 간격: `gap: 16`

## 타이포그래피
- 폰트: **Pretendard** (`expo-font`로 로드)

| 용도 | 스타일 |
|------|--------|
| 문항 텍스트 | `fontSize: 20, fontWeight: '600', color: '#191F28', lineHeight: 28` |
| 버튼 텍스트 | `fontSize: 17, fontWeight: '600'` |
| 해설 텍스트 | `fontSize: 15, color: '#6B7684', lineHeight: 22` |
| 결과 등급 | `fontSize: 32, fontWeight: '700', color: '#191F28'` |
| 보조 텍스트 | `fontSize: 14, color: '#B0B8C1'` |

## 애니메이션
- 문항 전환: `translateX 슬라이드 (duration: 350ms, easing: Easing.inOut)`
- 정답 피드백: `scale 1 → 1.02 → 1 (duration: 200ms)`
- 페이지 진입: `opacity 0→1 + translateY 12→0 (duration: 300ms)`
- 프로그레스 바: `width withTiming (duration: 300ms)`
- 그 외 모든 애니메이션 금지 — 목적 없는 모션은 토스답지 않음

## 아이콘
- `react-native-svg` 인라인 SVG만 사용
- strokeWidth: 1.5
- 아이콘 컨테이너(둥근 배경 박스)로 감싸지 않는다
- 크기: `width={20} height={20}` 기본, 결과 화면만 `width={32} height={32}`