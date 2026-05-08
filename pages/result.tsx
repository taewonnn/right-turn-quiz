import { InlineAd } from '@apps-in-toss/framework';
import { createRoute } from '@granite-js/react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { questions } from '../src/data/questions';
import type { ResultParams } from '../src/types/quiz';

export const Route = createRoute('/result', {
  validateParams: (params): ResultParams => {
    const p = params as { score?: unknown };
    return { score: typeof p.score === 'number' ? p.score : 0 };
  },
  component: ResultPage,
});

type Grade = {
  label: string;
  message: string;
  color: string;
};

function getGrade(score: number): Grade {
  if (score >= 9)
    return {
      label: '우회전 마스터',
      message: '도로 위 법규는 완벽해요. 단속 카메라가 오히려 당신을 반겨요.',
      color: '#00C853',
    };
  if (score >= 7)
    return {
      label: '우회전 고수',
      message: '거의 다 알고 있어요. 한두 개 놓친 게 아깝네요.',
      color: '#3182F6',
    };
  if (score >= 5)
    return {
      label: '우회전 중수',
      message: '반은 알고 반은 몰랐어요. 위험한 순간이 있었을 거예요.',
      color: '#FF9500',
    };
  if (score >= 3)
    return {
      label: '우회전 초보',
      message: '솔직히 지금까지 운이 좋았던 거예요. 다시 공부해보세요.',
      color: '#FF6B00',
    };
  return {
    label: '우회전 위험',
    message: '이미 벌금 고지서가 날아왔거나 사고가 났을 수도 있어요.',
    color: '#FF3B30',
  };
}

function ResultPage() {
  const navigation = Route.useNavigation();
  const { score } = Route.useParams();
  const total = questions.length;
  const grade = getGrade(score);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleRetry = () => {
    navigation.navigate('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>내 점수</Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreNumber, { color: grade.color }]}>{score}</Text>
            <Text style={styles.scoreTotal}> / {total}</Text>
          </View>
          <View style={[styles.gradeBadge, { backgroundColor: grade.color + '1A' }]}>
            <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>
          </View>
          <Text style={styles.gradeMessage}>{grade.message}</Text>
        </View>

        <View style={styles.adContainer}>
          <InlineAd
            adGroupId="ait.v2.live.8a819d7c24cd4f0c"
            theme="auto"
            tone="blackAndWhite"
            variant="expanded"
            impressFallbackOnMount={true}
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>결과 요약</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>정답</Text>
            <Text style={[styles.summaryValue, { color: '#00C853' }]}>{score}문항</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>오답</Text>
            <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>{total - score}문항</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>정답률</Text>
            <Text style={styles.summaryValue}>
              {Math.round((score / total) * 100)}%
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
          <Text style={styles.retryButtonText}>다시 풀기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 16,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7684',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 72,
  },
  adContainer: {
    width: '100%',
    minHeight: 96,
    overflow: 'hidden',
    borderRadius: 16,
  },
  scoreTotal: {
    fontSize: 24,
    fontWeight: '600',
    color: '#B0B8C1',
    paddingBottom: 8,
  },
  gradeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  gradeLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  gradeMessage: {
    fontSize: 15,
    color: '#6B7684',
    textAlign: 'center',
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191F28',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#6B7684',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#191F28',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F6',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },
  retryButton: {
    backgroundColor: '#3182F6',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
